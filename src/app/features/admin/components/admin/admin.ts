import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from 'src/app/features/auth/services/auth';
import { User } from '../../../auth/models/user';
import { Item } from 'src/app/features/items/models/item';
import { ItemService } from 'src/app/features/items/services/item';
import { CreateItemForm } from 'src/app/shared/components/create-item-form/create-item-form';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, CreateItemForm],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Interfact</h1>
        <p class="text-gray-600 mt-2">Manage users and stock</p>
      </div>

      <!-- Admin Nav -->
      <div class="mb-8">
        <nav class="flex space-x-4">
          <button
            (click)="activeTab.set('users')"
            [class.bg-blue-600]="activeTab() === 'users'"
            [class.text-white]="activeTab() === 'users'"
            [class.text-gray-700]="activeTab() !== 'users'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Users
          </button>
          <button
            (click)="activeTab.set('stock')"
            [class.bg-blue-600]="activeTab() === 'stock'"
            [class.text-white]="activeTab() === 'stock'"
            [class.text-gray-700]="activeTab() !== 'stock'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Stock
          </button>
        </nav>
      </div>

      <!-- Notifications -->
      @if (message()) {
        <div
          class="relative text-center mt-4 p-3 rounded-md shadow-sm"
          [class.text-green-600]="!error()"
          [class.text-red-600]="error()"
          [class.bg-green-50]="!error()"
          [class.bg-red-50]="error()"
        >
          {{ message() }}
          <button
            type="button"
            (click)="message() === ''; error() === false"
            class="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      }

      <!-- Tab Content-->
      @if (activeTab() === 'users') {
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Manage users</h2>
          </div>
          <div class="p-6">
            @if (users().length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (user of users(); track user.id) {
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <div
                                class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                              >
                                <span class="text-sm font-medium text-gray-700">
                                  {{ user.name.charAt(0).toUpperCase() }}
                                </span>
                              </div>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                              <div class="text-sm text-gray-500">{{ user.email }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            [class.bg-red-100]="user.role === 'admin'"
                            [class.text-red-800]="user.role === 'admin'"
                            [class.bg-green-100]="user.role === 'user'"
                            [class.text-green-800]="user.role === 'user'"
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          >
                            {{ user.role | titlecase }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          @if (user.role !== 'admin') {
                            <button
                              (click)="deleteUser(user.id)"
                              class="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          } @else {
                            <span class="text-gray-400">Protected admin</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else if (loading()) {
              <p class="text-gray-500 text-center py-8">Loading...</p>
            } @else {
              <p class="text-gray-500 text-center py-8">No user found</p>
            }
          </div>
        </div>
      }

      <!-- Stock Tab -->
      @if (activeTab() === 'stock') {
        <button
          (click)="toggleForm()"
          class="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add New Item
        </button>
        @if (showForm()) {
          <app-item-form (save)="createItem($event)"></app-item-form>
        }
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Manage stock</h2>
          </div>
          <div class="p-6">
            @if (items().length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Item
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (item of items(); track item.id) {
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <div
                                class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                              >
                                <span class="text-sm font-medium text-gray-700">
                                  {{ item.name.charAt(0).toUpperCase() }}
                                </span>
                              </div>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                            </div>
                          </div>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-500 line-clamp-2">
                            {{ item.description }}
                          </div>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            [class.text-red-600]="item.quantity === 0"
                            [class.text-yellow-600]="item.quantity > 0 && item.quantity < 5"
                            [class.text-green-600]="item.quantity >= 5"
                            class="font-medium"
                          >
                            {{ item.quantity }}
                          </span>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            (click)="deleteItem(item.id)"
                            class="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="text-gray-500 text-center py-8">No item found</p>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  public itemService = inject(ItemService);

  activeTab = signal<'users' | 'stock'>('users');
  users = signal<User[]>([]);
  items = signal<Item[]>([]);
  showForm = signal<boolean>(false);
  loading = signal<boolean>(true);
  message = signal<string>('');
  error = signal<boolean>(false);

  async ngOnInit() {
    // Check if user is admin
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/']);
      return;
    }

    // Load datas
    await this.loadUsers();
    await this.loadItems();
  }

  async loadItems() {
    try {
      this.items.set(this.itemService.getAllItems());
    } catch (error) {
      console.error('Error while loading items :', error);
    }
  }

  async loadUsers() {
    this.loading.set(true);
    console.log('loading = true');
    try {
      this.authService.getAllUsers().subscribe((users) => {
        this.users.set(users);
        this.loading.set(false);
        console.log('loading = false');
      });
    } catch (error) {
      console.error('Error while loading users :', error);
      this.loading.set(false);
      console.log('loading = false');
    }
  }

  async deleteItem(itemId: string) {
    if (confirm('Are you sure you want to delete this item ?')) {
      try {
        await this.itemService.remove(itemId);
        await this.loadItems();
      } catch (error) {
        console.error('Error while deleting:', error);
      }
    }
  }

  async deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user ?')) {
      try {
        await this.authService.deleteUser(userId);
        await this.loadUsers();
      } catch (error) {
        console.error('Error while deleting:', error);
      }
    }
  }

  async createItem(newItem: Item) {
    this.loading.set(true);
    this.message.set('');
    this.error.set(false);

    try {
      this.itemService.add(newItem);
      this.message.set('✅ Item created successfully!');
      this.showForm.set(false);
      await this.loadItems();
    } catch (err) {
      console.error(err);
      this.message.set('❌ Error creating item');
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
  }
}
