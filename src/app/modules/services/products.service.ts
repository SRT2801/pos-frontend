import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '../../app.config';
import { Product } from '../products/models/product.interface';
import { CreateProductDto } from '../products/dto/create-product.dto';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);

  listar() {
    return this.http.get<Product[]>(`${this.apiBase}productos`);
  }

  obtenerPorId(id: string) {
    return this.http.get<Product>(`${this.apiBase}productos/${encodeURIComponent(id)}`);
  }

  crear(data: CreateProductDto) {
    return this.http.post<Product>(`${this.apiBase}productos`, data);
  }
}
