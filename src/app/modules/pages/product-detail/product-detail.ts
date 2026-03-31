import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductosService } from '../../shared/services/products.service';
import { Product } from '../../products/interfaces/product.interface';
import { ProductDetailComponent } from '../../shared/components/ui/product-detail/product-detail';
import { ProgressSpinnerService } from '../../shared/services/progress-spinner.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductDetailComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailPage implements OnInit {
  product = signal<Product | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductosService);
  private spinner = inject(ProgressSpinnerService);
  private toast = inject(ToastService);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  loadProduct(id: string) {
    this.spinner.show();
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Failed to load product', err);
        this.toast.error('Failed to load product details');
        this.spinner.hide();
        this.router.navigate(['/products']);
      },
    });
  }

  duplicateProduct() {
    this.toast.success('Product duplication triggered');
    // Implement duplicate logic
  }

  editProduct() {
    if (this.product()) {
      // In a real app we might navigate to an edit form
      this.toast.success('Editing product...');
      this.router.navigate(['/products/edit', this.product()!.id]);
    }
  }
}
