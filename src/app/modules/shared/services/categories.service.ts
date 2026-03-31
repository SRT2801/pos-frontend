import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '../../../app.config';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { Category } from '../../categories/interfaces/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);

  getCategories() {
    return this.http.get<Category[]>(`${this.apiBase}/categories`);
  }

  getCategoryById(id: string, includeProducts: boolean = false) {
    const url = includeProducts
      ? `${this.apiBase}/categories/${encodeURIComponent(id)}?products=true`
      : `${this.apiBase}/categories/${encodeURIComponent(id)}`;
    return this.http.get<Category>(url);
  }

  createCategory(data: { name: string }) {
    return this.http.post<Category>(`${this.apiBase}/categories`, data);
  }
}
