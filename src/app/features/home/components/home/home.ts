import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ItemService } from 'src/app/features/items/services/item';
import { Item } from 'src/app/features/items/models/item';
import { Auth } from 'src/app/features/auth/services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6 text-center">Shop Inventory</h1>

      <!-- Search bar -->
      <div class="flex justify-center mb-8">
        <input
          type="text"
          [value]="searchTerm()"
          (input)="searchTerm.set($any($event.target).value)"
          placeholder="Search items..."
          class="w-full max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      @if (authService.isAdmin()) {
        <button
          (click)="toggleForm()"
          class="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add New Item
        </button>
      }

      @if (showForm) {
        <form
          [formGroup]="itemForm"
          (ngSubmit)="createItem()"
          class="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md mb-8"
        >
          <div class="mb-4">
            <label for="name" class="block mb-1 font-medium">Name</label>
            <input formControlName="name" type="text" class="w-full border rounded p-2" />
            @if (itemForm.get('name')?.invalid && itemForm.get('name')?.touched) {
              <p class="text-red-500 text-sm">Name is required</p>
            }
          </div>

          <div class="mb-4">
            <label for="description" class="block mb-1 font-medium">Description</label>
            <textarea formControlName="description" class="w-full border rounded p-2"></textarea>
            @if (itemForm.get('description')?.invalid && itemForm.get('description')?.touched) {
              <p class="text-red-500 text-sm">Description must be at least 10 characters</p>
            }
          </div>

          <div class="mb-4">
            <label for="photo" class="block mb-1 font-medium">Photo URL</label>
            <input formControlName="photo" type="url" class="w-full border rounded p-2" />
            @if (itemForm.get('photo')?.invalid && itemForm.get('photo')?.touched) {
              <p class="text-red-500 text-sm">Must be a valid URL</p>
            }
          </div>

          <div class="mb-4">
            <label for="quantity" class="block mb-1 font-medium">Quantity</label>
            <input formControlName="quantity" type="number" class="w-full border rounded p-2" />
            @if (itemForm.get('quantity')?.invalid && itemForm.get('quantity')?.touched) {
              <p class="text-red-500 text-sm">Quantity must be a number ≥ 0</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="itemForm.invalid || loading"
            class="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
          >
            @if (!loading) {
              <span>Create Item</span>
            } @else {
              <span class="animate-pulse">Creating...</span>
            }
          </button>
        </form>
      }

      <!-- Notifications -->
      @if (message) {
        <div
          class="relative text-center mt-4 p-3 rounded-md shadow-sm"
          [class.text-green-600]="!error"
          [class.text-red-600]="error"
          [class.bg-green-50]="!error"
          [class.bg-red-50]="error"
        >
          {{ message }}
          <button
            type="button"
            (click)="message = ''; error = false"
            class="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      }

      <!-- Items grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (item of filteredItems(); track $index) {
          <a
            [routerLink]="['items', item.id]"
            class="block bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            @if (item.photo) {
              <img [src]="item.photo" alt="{{ item.name }}" class="w-full h-40 object-cover" />
            }

            <div class="p-4 flex flex-col h-2/4">
              <h2 class="text-xl font-semibold mb-2">{{ item.name }}</h2>
              <p class="text-gray-600 text-sm line-clamp-3">{{ item.description }}</p>
              <p class="mt-auto font-medium pt-3">
                Quantity:
                <span [class.text-red-500]="item.quantity === 0">{{ item.quantity }}</span>
              </p>
            </div>
          </a>
        }
      </div>
      @if (filteredItems().length === 0) {
        <p class="text-center text-gray-500 mt-6">No items match your search.</p>
      }
    </div>
  `,
})
export class Home {
  private itemService = inject(ItemService);
  authService = inject(Auth);
  fb = inject(FormBuilder);

  searchTerm = signal<string>('');
  showForm = false;
  loading = false;
  message = '';
  error = false;

  itemForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    photo: ['', Validators.pattern(/https?:\/\/.+/)],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  toggleForm() {
    this.showForm = !this.showForm;
  }

  filteredItems = computed<Item[]>(() => {
    const query = this.searchTerm().toLowerCase();
    return this.itemService
      .items()
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
      );
  });

  async createItem() {
    if (this.itemForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.error = false;

    try {
      // const newItem = {
      //   id: Date.now().toString(),
      //   ...this.itemForm.value,
      // };

      const newItem: Item = {
        id: Date.now().toString(),
        name: this.itemForm.value.name ?? '',
        description: this.itemForm.value.description ?? '',
        photo: this.itemForm.value.photo ?? undefined,
        quantity: this.itemForm.value.quantity ?? 0,
      };

      this.itemService.add(newItem);
      this.message = '✅ Item created successfully!';
      this.itemForm.reset({ quantity: 0 });
      this.showForm = false;
    } catch (err) {
      console.error(err);
      this.message = '❌ Error creating item';
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
}
