import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '../../../app.config';
import { Product } from '../../products/interfaces/product.interface';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface PaginatedProducts {
  products: Product[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);

  private cache = new Map<string, PaginatedProducts>();

  getProducts(take: number = 10, skip: number = 0): Observable<PaginatedProducts> {
    const cacheKey = `${take}-${skip}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    return this.http
      .get<PaginatedProducts>(`${this.apiBase}/products?take=${take}&skip=${skip}`)
      .pipe(tap((response) => this.cache.set(cacheKey, response)));
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.apiBase}/products/${encodeURIComponent(id)}`);
  }

  createProduct(data: CreateProductDto) {
    return this.http
      .post<Product>(`${this.apiBase}/products`, data)
      .pipe(tap(() => this.clearCache()));
  }

  clearCache() {
    this.cache.clear();
  }

  uploadImages(files: File[]): Observable<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http.post<string[]>(`${this.apiBase}/products/upload-images`, formData);
  }
}
