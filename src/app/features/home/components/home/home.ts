import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ItemService } from 'src/app/features/items/services/item';
import { Item } from 'src/app/features/items/models/item';
import { Auth } from 'src/app/features/auth/services/auth';
import { CreateItemForm } from 'src/app/shared/components/create-item-form/create-item-form';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, CreateItemForm],
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
        <app-item-form (save)="createItem($event)"></app-item-form>
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

  async createItem(newItem: Item) {
    this.loading = true;
    this.message = '';
    this.error = false;

    try {
      this.itemService.add(newItem);
      this.message = '✅ Item created successfully!';
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
