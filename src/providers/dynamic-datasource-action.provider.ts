import {CoreBindings, inject, injectable, Provider} from '@loopback/core';
import {RepositoryBindings, RepositoryTags} from '@loopback/repository';
import {
  asMiddleware,
  ExpressRequestHandler,
  getMiddlewareContext,
  HttpErrors,
  Middleware,
  RequestContext,
  RestApplication,
} from '@loopback/rest';
import {DynamicDatasourceMiddleware} from '../dynamic-datasource.enum';
import {DynamicDatasourceBindings} from '../keys';
import {
  DatasourceIdentifierFn,
  DatasourceProviderFn,
  SetupDatasourceFn,
} from '../types';

export class DynamicDatasourceActionProvider
  implements Provider<SetupDatasourceFn>
{
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: RestApplication,
    @inject(DynamicDatasourceBindings.DATASOURCE_IDENTIFIER_PROVIDER)
    private readonly getDatasourceIdentifier: DatasourceIdentifierFn,
    @inject(DynamicDatasourceBindings.DATASOURCE_PROVIDER)
    private readonly getDatasourceProvider: DatasourceProviderFn,
  ) {}

  value(): SetupDatasourceFn {
    return async ctx => {
      await this.action(ctx as RequestContext);
    };
  }

  async action(requestCtx: RequestContext) {
    const datasourceIdentifier = await this.bindDatabaseIdentifier(requestCtx);
    if (datasourceIdentifier == null) return;
    const datasourceProvider =
      await this.getDatasourceProvider(datasourceIdentifier);
    const promises = Object.entries(datasourceProvider).map(async value => {
      const [key, method] = value;
      const dbBindKey = `${RepositoryBindings.DATASOURCES}.${key}.${datasourceIdentifier.id}`;
      if (!this.application.isBound(dbBindKey)) {
        const datasource = await method();
        this.application
          .bind(dbBindKey)
          .to(datasource)
          .tag(RepositoryTags.DATASOURCE);
      }
      requestCtx
        .bind(`${RepositoryBindings.DATASOURCES}.${key}`)
        .toAlias(dbBindKey);
    });
    await Promise.all(promises);
  }

  private async bindDatabaseIdentifier(requestCtx: RequestContext) {
    const datasourceIdentifier = await this.getDatasourceIdentifier(requestCtx);
    if (datasourceIdentifier) {
      requestCtx
        .bind(DynamicDatasourceBindings.CURRENT_INDETIFIER)
        .to(datasourceIdentifier);
    }
    return datasourceIdentifier;
  }
}

@injectable(
  asMiddleware({
    chain: DynamicDatasourceMiddleware.CHAIN,
    group: DynamicDatasourceMiddleware.GROUP,
  }),
)
export class DynamicDatasourceMiddlewareProvider
  implements Provider<Middleware>
{
  constructor(
    @inject(DynamicDatasourceBindings.DYNAMIC_DATASOURCE_ACTION)
    private readonly setupDatasource: SetupDatasourceFn,
  ) {}
  value(): Middleware {
    return async (ctx, next) => {
      await this.setupDatasource(ctx as RequestContext);
      return next();
    };
  }
}

//This middleware function can be used with express middlewares to get invoked with express them.
/**
 * @param req Request object
 * @param res Response object
 * @param next Method
 * @returns Calls Next Method
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const setupDataSourceMiddlewareFunction: ExpressRequestHandler = async (
  req,
  res,
  next,
) => {
  const reqCtx = getMiddlewareContext<RequestContext>(req);
  if (!reqCtx) {
    throw new HttpErrors.InternalServerError(
      'Request context is not available.',
    );
  }
  const setupDatasource = await reqCtx.get(
    DynamicDatasourceBindings.DYNAMIC_DATASOURCE_ACTION,
  );
  if (!setupDatasource) {
    throw new HttpErrors.InternalServerError(
      'setupDatasource function not found.',
    );
  }
  await setupDatasource(reqCtx);
  if (next) return next();
  else return;
};
