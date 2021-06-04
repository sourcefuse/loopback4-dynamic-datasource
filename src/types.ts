/**
 * Interface defining the component's options object
 */
import {RequestContext} from '@loopback/rest';
import {juggler} from '@loopback/repository';

export interface Loopback4DynamicDatasourceComponentOptions {
  // Add the definitions here
}

/**
 * Default options for the component
 */
export const DEFAULT_LOOPBACK4_DYNAMIC_DATASOURCE_OPTIONS: Loopback4DynamicDatasourceComponentOptions =
  {
    // Specify the values here
  };

export interface DatasourceIdentifier {
  id: string;
  [attribute: string]: unknown;
}

export interface DatasourceProviderFn {
  (datasourceIdentifier: DatasourceIdentifier): Promise<{
    [prop: string]: () => Promise<juggler.DataSource>;
  }>;
}

export interface DatasourceIdentifierFn {
  (requestCtx: RequestContext): Promise<DatasourceIdentifier | null>;
}

export interface SetupDatasourceFn {
  (requestCtx: RequestContext): Promise<void>;
}
