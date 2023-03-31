import { IPostgresConfig } from './interfaces';
import * as config from 'config';

export const postgressConfig: IPostgresConfig =
    config.get<IPostgresConfig>('postgres');
