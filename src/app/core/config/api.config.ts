import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  readonly baseUrl: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

export const apiConfig: ApiConfig = {
  baseUrl: 'https://itx-frontend-test.onrender.com/api',
};
