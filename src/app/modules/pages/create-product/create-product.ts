import { Component, signal, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../shared/components/ui/input/input';
import { ProductosService } from '../../shared/services/products.service';
import { ToastService } from '../../shared/services/toast.service';
import { ProgressSpinnerService } from '../../shared/services/progress-spinner.service';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { CategoryService } from '../../shared/services/categories.service';
import { Category } from '../../categories/interfaces/category.interface';
import { switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export class CreateProductPage implements OnInit {
  name = signal('');
  description = signal('');
  price = signal('');
  inventory = signal('');
  categoryId = signal('');
  images = signal<string[]>([]);

  // Category Creation Signals
  isCreatingCategory = signal(false);
  newCategoryName = signal('');
  isSavingCategory = signal(false);

  // UI State Signals
  loading = signal(false);
  error = signal<string | null>(null);
  imagePreview = signal<string | null>(null);
  selectedFile = signal<File | null>(null);

  private productsService = inject(ProductosService);
  private categoryService = inject(CategoryService);
  private toast = inject(ToastService);
  private spinner = inject(ProgressSpinnerService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  categories = signal<Category[]>([]);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarCategorias();
    }
  }

  cargarCategorias() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.toast.error('No se pudieron cargar las categorías');
      },
    });
  }

  cancelCreateCategory() {
    this.isCreatingCategory.set(false);
    this.newCategoryName.set('');
  }

  createCategory() {
    const name = this.newCategoryName().trim();
    if (!name) return;

    this.isSavingCategory.set(true);
    this.categoryService.createCategory({ name }).subscribe({
      next: (newCategory) => {
        // Añade la nueva categoría a la lista de signals reactiva
        this.categories.update((cats) => [...cats, newCategory]);
        // Auto-selecciona la categoría recién creada
        this.categoryId.set(String(newCategory.id));

        this.toast.success('Categoría creada exitosamente');
        this.isSavingCategory.set(false);
        this.isCreatingCategory.set(false);
        this.newCategoryName.set('');
      },
      error: (err: any) => {
        this.isSavingCategory.set(false);
        this.toast.error(err.error?.message || 'Error al crear la categoría');
      },
    });
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const url = URL.createObjectURL(file);
      this.imagePreview.set(url);
    }
  }

  removeImage() {
    this.selectedFile.set(null);
    this.imagePreview.set(null);
    this.images.set([]);
  }

  onSubmit() {
    this.error.set(null);

    if (
      !this.name() ||
      this.price() === '' ||
      this.inventory() === '' ||
      this.categoryId() === ''
    ) {
      this.error.set('Por favor, completa todos los campos requeridos.');
      this.toast.error('Faltan campos obligatorios');
      return;
    }

    this.loading.set(true);
    this.spinner.show();

    const fileToUpload = this.selectedFile();
    const upload$ = fileToUpload ? this.productsService.uploadImages([fileToUpload]) : of([]);

    upload$
      .pipe(
        switchMap((res: any) => {
          // Extraer las URLs dependiendo de la estructura de respuesta del backend.
          // Si es un arreglo de strings, se usa tal cual.
          // Si es un objeto o arreglo de objetos, mapeamos a las propiedades `url` o `secure_url`.
          let urls: string[] = [];
          if (Array.isArray(res)) {
            urls = res.map((item) =>
              typeof item === 'string' ? item : item.url || item.secure_url || item.secureUrl,
            );
          } else if (res && (res.url || res.secure_url || res.secureUrl)) {
            urls = [res.url || res.secure_url || res.secureUrl];
          }

          const imageUrls = urls && urls.length > 0 ? urls : ['images/default-product.png'];

          const newProduct: CreateProductDto = {
            name: this.name(),
            description: this.description(),
            price: Number(this.price()),
            inventory: Number(this.inventory()),
            categoryId: Number(this.categoryId()),
            images: imageUrls,
          };
          return this.productsService.createProduct(newProduct);
        }),
      )
      .subscribe({
        next: () => {
          this.toast.success('Producto creado exitosamente');
          this.spinner.hide();
          this.loading.set(false);
          this.router.navigate(['/products']);
        },
        error: (err: any) => {
          this.spinner.hide();
          this.loading.set(false);
          const errorMsg = err.error?.message || 'Hubo un error al crear el producto';
          this.error.set(errorMsg);
          this.toast.error(errorMsg);
        },
      });
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
