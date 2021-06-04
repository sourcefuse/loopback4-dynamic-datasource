import {Provider} from '@loopback/core';
import {DatasourceProviderFn} from '../types';

export class DatasourceProvider implements Provider<DatasourceProviderFn> {
    constructor() {
    }

    value(): DatasourceProviderFn {
        return async () => {
            return {}
        }
    }
}
