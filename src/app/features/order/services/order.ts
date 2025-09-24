import { inject, Injectable, signal } from '@angular/core';
import { Order } from '../model/order';
import { ItemService } from '../../items/services/item';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();
  private itemService = inject(ItemService);

  placeOrder(itemId: string, userId: number, quantity: number): void {
    const item = this.itemService.getById(itemId);
    if (!item) throw new Error('Item not found');
    if (item.quantity < quantity) throw new Error('Not enough stock');

    const order: Order = {
      id: Date.now().toString(),
      itemId,
      userId,
      quantity,
      status: 'pending',
      createdAt: new Date(),
    };

    this._orders.update((prev) => [...prev, order]);
  }

  updateStatus(orderId: string, status: Order['status']): void {
    this._orders.update((orders) => orders.map((o) => (o.id === orderId ? { ...o, status } : o)));

    // If approved, reduce stock
    if (status === 'approved') {
      const order = this._orders().find((o) => o.id === orderId);
      if (order) this.itemService.decreaseQuantity(order.itemId, order.quantity);
    }
  }

  getOrdersByUser(userId: number) {
    return this._orders().filter((o) => o.userId === userId);
  }
}
