import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { API_BASE_URL } from '../../../../app.config';
import { isPlatformBrowser } from '@angular/common';

export const storeIterceptor: HttpInterceptorFn = (req, next) => {
  const apiBase = inject(API_BASE_URL);
  const platformId = inject(PLATFORM_ID);

  if (!req.url.startsWith(apiBase)) {
    return next(req);
  }

  const storeId = isPlatformBrowser(platformId) ? sessionStorage.getItem('activeStoreId') : null;

  if (!storeId) {
    return next(req);
  }

  const requWithStoreId = req.clone({
    setHeaders: {
      'X-Store-ID': storeId,
    },
  });
  return next(requWithStoreId);
};
