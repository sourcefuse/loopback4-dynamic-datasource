# loopback4-dynamic-datasource

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install Loopback4DynamicDatasourceComponent using `npm`;

```sh
$ [npm install | yarn add] loopback4-dynamic-datasource
```

## Basic Use

Configure and load Loopback4DynamicDatasourceComponent in the application constructor
as shown below.

```ts
import {Loopback4DynamicDatasourceComponent, Loopback4DynamicDatasourceComponentOptions, DEFAULT_LOOPBACK4_DYNAMIC_DATASOURCE_OPTIONS} from 'loopback4-dynamic-datasource';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: Loopback4DynamicDatasourceComponentOptions = DEFAULT_LOOPBACK4_DYNAMIC_DATASOURCE_OPTIONS;
    this.configure(Loopback4DynamicDatasourceComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(Loopback4DynamicDatasourceComponent);
    // ...
  }
  // ...
}
```
