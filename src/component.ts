import {
  Application,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  injectable,
  ProviderMap,
} from '@loopback/core';
import {
  DynamicDatasourceBindings,
  Loopback4DynamicDatasourceComponentBindings,
} from './keys';
import {
  DEFAULT_LOOPBACK4_DYNAMIC_DATASOURCE_OPTIONS,
  Loopback4DynamicDatasourceComponentOptions,
} from './types';
import {
  DatasourceIdentifierProvider,
  DatasourceProvider,
  DynamicDatasourceActionProvider,
  DynamicDatasourceMiddlewareProvider,
} from './providers';

// Configure the binding for Loopback4DynamicDatasourceComponent
@injectable({
  tags: {
    [ContextTags.KEY]: Loopback4DynamicDatasourceComponentBindings.COMPONENT,
  },
})
export class Loopback4DynamicDatasourceComponent implements Component {
  providers: ProviderMap = {
    [DynamicDatasourceBindings.DYNAMIC_DATASOURCE_ACTION.key]:
      DynamicDatasourceActionProvider,
    [DynamicDatasourceBindings.DATASOURCE_PROVIDER.key]: DatasourceProvider,
    [DynamicDatasourceBindings.DATASOURCE_IDENTIFIER_PROVIDER.key]:
      DatasourceIdentifierProvider,
    [DynamicDatasourceBindings.MIDDLEWARE.key]:
      DynamicDatasourceMiddlewareProvider,
  };

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: Loopback4DynamicDatasourceComponentOptions = DEFAULT_LOOPBACK4_DYNAMIC_DATASOURCE_OPTIONS,
  ) {}
}
