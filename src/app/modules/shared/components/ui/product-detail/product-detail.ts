import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../products/interfaces/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent {
  @Input({ required: true }) product!: Product;

  // Mocked data for fields not in Product interface based on design
  mockedStats = {
    sales: { value: '12,482', change: '+12%', type: 'increase' },
    revenue: { value: '$24,964', change: '+5.2%', type: 'increase' },
    stockStatus: { level: 'Optimal', fill: '82%', color: 'amber' },
  };

  mockedSpecs = [
    { label: 'Volume', value: '600ml' },
    { label: 'Packaging', value: 'PET Bottle' },
    { label: 'Weight', value: '0.64 kg' },
    { label: 'Tax Class', value: 'Standard (15%)' },
  ];

  mockedWarehouses = [
    {
      location: 'East Coast Logistics - NJ',
      stock: '2,140 units',
      threshold: '500 units',
      status: 'Healthy',
      statusColor: 'emerald',
    },
    {
      location: 'Pacific Hub - CA',
      stock: '1,850 units',
      threshold: '800 units',
      status: 'Healthy',
      statusColor: 'emerald',
    },
    {
      location: 'Central Plains - TX',
      stock: '211 units',
      threshold: '250 units',
      status: 'Low Stock',
      statusColor: 'amber',
    },
  ];

  getImageUrl(image: string | string[] | undefined): string {
    if (!image) return '';
    return Array.isArray(image) ? image[0] : image;
  }
}
