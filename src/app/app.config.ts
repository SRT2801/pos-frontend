import {
  ApplicationConfig,
  InjectionToken,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { authInterceptor } from './modules/core/http/interceptors/auth.interceptor';
import { errorInterceptor } from './modules/core/http/interceptors/error.interceptor';
import { storeIterceptor } from './modules/core/http/interceptors/store.interceptor';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([storeIterceptor, authInterceptor, errorInterceptor]),
    ),
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    MessageService,
  ],
};
