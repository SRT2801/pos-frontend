import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardData } from '../interfaces/product-data.interface';



@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: ProductCardData;
  @Output() addToCart = new EventEmitter<ProductCardData>();
  @Output() toggleFavorite = new EventEmitter<ProductCardData>();
  @Output() viewProduct = new EventEmitter<ProductCardData>();

  isFavorite = false;

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    this.toggleFavorite.emit(this.product);
  }

  onViewProduct(): void {
    this.viewProduct.emit(this.product);
  }

  get formattedPrice(): string {
    return `$${this.product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  get formattedOriginalPrice(): string {
    if (!this.product.originalPrice) return '';
    return `$${this.product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  get badgeClass(): string {
    const base = 'product-card__badge';
    return this.product.badgeType ? `${base} ${base}--${this.product.badgeType}` : base;
  }

  get ratingStars(): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const rating = this.product.rating || 0;
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('full');
      } else if (rating >= i - 0.5) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }
}
