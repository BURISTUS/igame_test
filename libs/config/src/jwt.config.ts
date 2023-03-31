import { IJWTConfig } from './interfaces';
import * as config from 'config';

export const jwtConfig: IJWTConfig = config.get<IJWTConfig>('jwt');
