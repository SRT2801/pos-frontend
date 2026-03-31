import { Component, signal, PLATFORM_ID, inject, OnInit, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductCardData } from '../../shared/components/ui/interfaces/product-data.interface';

import { ProductosService } from '../../shared/services/products.service';
import { ProgressSpinnerService } from '../../shared/services/progress-spinner.service';
import {
  TableComponent,
  TableHeaderDirective,
  TableRowDirective,
} from '../../shared/components/ui/product-table/product-table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, TableComponent, TableHeaderDirective, TableRowDirective, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsPage implements OnInit {
  private productsService = inject(ProductosService);
  private spinner = inject(ProgressSpinnerService);
  private platformId = inject(PLATFORM_ID);

  readonly products = signal<ProductCardData[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly totalProducts = signal<number>(0);

  getImageUrl(image: string | string[] | undefined): string {
    if (!image) return 'images/default-product.png';
    return Array.isArray(image) ? image[0] : image;
  }

  readonly itemsPerPage = 8;
  readonly currentPage = signal<number>(1);

  readonly totalPages = computed(() => Math.ceil(this.totalProducts() / this.itemsPerPage));

  readonly searchQuery = signal('');
  readonly selectedCategory = signal('all');

  readonly categories = [
    { value: 'all', label: 'All Laptops' },
    { value: 'premium', label: 'Premium' },
    { value: 'creator', label: 'Creator' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'student', label: 'Student' },
  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarProductos();
    } else {
      this.loading.set(false);
    }
  }

  cargarProductos() {
    this.loading.set(true);
    this.error.set(null);

    const skip = (this.currentPage() - 1) * this.itemsPerPage;

    this.productsService.getProducts(this.itemsPerPage, skip).subscribe({
      next: (data) => {
        const mappedProducts: ProductCardData[] = data.products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          inventory: p.inventory,
          categoryId: p.categoryId,
          image: p.images || ['images/default-product.png'],
        }));

        this.products.set(mappedProducts);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.error.set('No se pudieron cargar los productos');
        this.loading.set(false);
      },
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.cargarProductos();
    }
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onToggleFavorite(product: ProductCardData): void {
    console.log('Toggled favorite:', product.name);
  }

  onViewProduct(product: ProductCardData): void {
    console.log('View product:', product.name);
  }

  onAddToCart(product: ProductCardData): void {
    console.log('Add to cart:', product.name);
  }
}
