# loopback4-dynamic-datasource

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

This is a loopback 4 extension to connect dynamic datasources runtime. In todays world there can be a use case of multi tenant system in which we need the physical
seperation of the databses so in loopback we need to connect to those datasources runtime and maintain and reuse those connection.

![Image of Architecture](https://github.com/sourcefuse/loopback4-dynamic-datasource/blob/master/architecture.jpg)
## Install

```sh
npm install loopback4-dynamic-datasource
```

## Usage

In order to use this component into your LoopBack application, please follow below steps.

- Add component to application.

```ts
this.component(Loopback4DynamicDatasourceComponent);
```

- Now add action provider to the action based sequence (This step is not required in case of middleware based sequence)

```ts
export class MySequence implements SequenceHandler {

    constructor(
        ...
        @inject(DynamicDatasourceBindings.DYNAMIC_DATASOURCE_ACTION)
        private readonly setupDatasource: SetupDatasourceFn,
        ...
    ) {}

    async handle(context: RequestContext) {
        const requestTime = Date.now();
        try {
            ...
            await this.setupDatasource(context);
            ...
        } catch (err) {
            this.reject(context, err);
        }
    }

}
```

- Now write a datasource identifier provider that is used to identify runtime which source we need to connect.
In below example getting the identifier from the tenantId coming in query of the request.
```ts
import {DatasourceIdentifierFn} from 'loopback4-dynamic-datasouce';

export class CustomDatasourceIdentifierProvider implements Provider<DatasourceIdentifierFn> {
    constructor() {
    }

    value(): DatasourceIdentifierFn {
        return async (requestCtx) => {
            const tenantId = requestCtx.request.query['tenantId'] as string;
            return tenantId == null ? null : {id: tenantId};
        };
    }
}
```
Now bind that provider in application.ts
```ts
this.bind(DynamicDatasourceBindings.DATASOURCE_IDENTIFIER_PROVIDER).toProvider(CustomDatasourceIdentifierProvider); 
```
- Now write a datasource provider to get datasources runtime. these datasource will be created runtime on require basis
```ts
export class CustomDatasourceProvider implements Provider<DatasourceProviderFn> {
    constructor(
        @repository(TenantRepository)
        private tenantRepo: TenantRepository,
    ) {
    }

    value(): DatasourceProviderFn {
        return async (datasourceIdentifier) => {
            return {
                pgdb: async () => {
                    const tenantData = await this.tenantRepo.findById(datasourceIdentifier.id);
                    return new juggler.DataSource({
                        ...tenantData.dbConfig,
                    });
                }
            }
        }
    }
}
```
Now bind that provider in application.ts
```ts
this.bind(DynamicDatasourceBindings.DATASOURCE_PROVIDER).toProvider(CustomDatasourceProvider);
```
Note:- connector of following datasource should be present in package.json like in this example we are using **loopback-connector-postgresql**

Now return of this provider is an object where you can give as many keys you want but that should return juggler.Datasource 
This is used as the intention of connecting multiple datasource for tenant.
`pgdb` this key is custom and it can be used as per your choice but your repository must use specified key in injection

```ts
export class UserRepository extends DefaultCrudRepository<User,
    typeof User.prototype.id,
    UserRelations> {
    constructor(
        @inject('datasources.pgdb') dataSource: JugglerDataSource,
    ) {
        super(User, dataSource);
    }
}
```

That's all.

## Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopBack4-dynamic-datasource/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopBack4-dynamic-datasource/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/sourcefuse/loopBack4-dynamic-datasource/blob/master/.github/CONTRIBUTING.md) for details on the process for submitting pull requests to us.

## Code of conduct

Code of conduct guidelines [here](https://github.com/sourcefuse/loopBack4-dynamic-datasource/blob/master/.github/CODE_OF_CONDUCT.md).

## License

[MIT](https://github.com/sourcefuse/loopBack4-dynamic-datasource/blob/master/LICENSE)
