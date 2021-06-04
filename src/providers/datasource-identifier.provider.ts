import {Provider} from '@loopback/core';
import {DatasourceIdentifierFn} from '../types';

export class DatasourceIdentifierProvider
  implements Provider<DatasourceIdentifierFn>
{
  constructor() {}

  value(): DatasourceIdentifierFn {
    return async () => {
      return null;
    };
  }
}
