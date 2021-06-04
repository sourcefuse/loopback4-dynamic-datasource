import {BindingKey, CoreBindings} from '@loopback/core';
import {Loopback4DynamicDatasourceComponent} from './component';
import {DatasourceIdentifier, DatasourceIdentifierFn, DatasourceProviderFn, SetupDatasourceFn} from "./types";
import {Middleware} from "@loopback/rest";

/**
 * Binding keys used by this component.
 */
export namespace Loopback4DynamicDatasourceComponentBindings {
  export const COMPONENT = BindingKey.create<Loopback4DynamicDatasourceComponent>(
    `${CoreBindings.COMPONENTS}.Loopback4DynamicDatasourceComponent`,
  );
}

export namespace DynamicDatasourceBindings {
  export const MIDDLEWARE = BindingKey.create<Middleware>(
      'middleware.dynamic-datasource',
  );

  export const DYNAMIC_DATASOURCE_ACTION = BindingKey.create<SetupDatasourceFn>(
      'dynamic-datasource.action',
  );

  export const CURRENT_INDETIFIER = BindingKey.create<DatasourceIdentifier>(
      'dynamic-datasource.currentIdentifier',
  );

  export const DATASOURCE_IDENTIFIER_PROVIDER = BindingKey.create<DatasourceIdentifierFn>(
      'dynamic-datasource.action.databaseIdentifier',
  );

  export const DATASOURCE_PROVIDER = BindingKey.create<DatasourceProviderFn>(
      'dynamic-datasource.action.datasourceProvider',
  );
}

export const DYNAMIC_DATASOURCE = 'dynamic-datasource';
