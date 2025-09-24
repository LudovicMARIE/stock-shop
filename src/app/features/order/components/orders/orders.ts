import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order';
import { ItemService } from 'src/app/features/items/services/item';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Orders</h2>

      @if (orders().length > 0) {
        <ul class="space-y-3">
          @for (order of orders(); track order.id) {
            <li class="p-4 bg-white rounded-lg shadow">
              <p><strong>User:</strong> {{ order.userId }}</p>
              <p><strong>Item:</strong> {{ getItemName(order.itemId) }}</p>
              <p><strong>Quantity:</strong> {{ order.quantity }}</p>
              <p><strong>Status:</strong> {{ order.status }}</p>

              @if (order.status === 'pending') {
                <div class="mt-2 space-x-2">
                  <button
                    (click)="approve(order.id)"
                    class="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>
                  <button
                    (click)="reject(order.id)"
                    class="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              }
            </li>
          }
        </ul>
      } @else {
        <p class="text-gray-500">No orders yet.</p>
      }
    </div>
  `,
})
export class OrdersComponent {
  private orderService = inject(OrderService);
  private itemService = inject(ItemService);

  orders = this.orderService.orders;

  approve(orderId: string) {
    this.orderService.updateStatus(orderId, 'approved');
  }

  reject(orderId: string) {
    this.orderService.updateStatus(orderId, 'rejected');
  }

  getItemName(itemId: string): string {
    return this.itemService.getById(itemId)?.name ?? 'Unknown';
  }
}
