import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../services/item';
import { Item } from '../../models/item';
import { RouterModule } from '@angular/router';
import { OrderService } from 'src/app/features/order/services/order';
import { Auth } from 'src/app/features/auth/services/auth';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <button
      routerLink="/"
      class="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
    >
      ← Back to Home
    </button>

    @if (item) {
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
            (click)="message.set(''); error.set(false)"
            class="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      }
      <div class="container mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
        <h2 class="text-2xl font-bold mb-2">{{ item.name }}</h2>
        <p class="text-gray-700 mb-4">{{ item.description }}</p>
        @if (item.photo) {
          <img
            [src]="item.photo"
            alt="{{ item.name }} picture"
            class="w-full h-48 object-cover rounded-lg mb-4"
          />
        }

        <p class="font-medium">
          Quantity in stock:
          <span [class.text-red-500]="item.quantity === 0">{{ item.quantity }}</span>
        </p>
        <button
          (click)="placeOrder(item.id)"
          [disabled]="item.quantity === 0"
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50 transition"
        >
          🛒 Order 1
        </button>
      </div>
    } @else {
      notFound
    }

    <ng-template #notFound>
      <p class="text-center text-red-500 mt-10">Item not found</p>
    </ng-template>
  `,
})
export class ItemDetailComponent {
  private route = inject(ActivatedRoute);
  private service = inject(ItemService);
  private orderService = inject(OrderService);
  private authService = inject(Auth);

  message = signal<string>('');
  error = signal<boolean>(false);

  item: Item | undefined;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.item = this.service.getById(id);
    }
  }

  placeOrder(itemId: string) {
    const user = this.authService.currentUser();
    if (!user) {
      this.message.set('You must be logged in to place an order.');
      this.error.set(true);
      return;
    }

    try {
      this.orderService.placeOrder(itemId, user.id, 1);
      this.message.set('Order placed successfully!');
      this.error.set(false);
    } catch (error) {
      this.message.set((error as Error).message);
      this.error.set(true);
    }
  }
}
