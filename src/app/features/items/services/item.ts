import { Injectable, signal, WritableSignal, computed } from '@angular/core';
import { Item } from '../models/item';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private _items: WritableSignal<Item[]> = signal<Item[]>([
    {
      id: '1',
      name: 'Laptop',
      description: 'High-performance laptop for work and play',
      photo: 'https://via.placeholder.com/200',
      quantity: 10,
    },
    {
      id: '2',
      name: 'Desk Chair',
      description: 'Ergonomic chair for comfortable sitting',
      photo: 'https://via.placeholder.com/200',
      quantity: 5,
    },
  ]);

  public readonly items = this._items.asReadonly();

  // Computed signal: total stock
  public readonly totalStock = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0),
  );

  getById(id: string): Item | undefined {
    return this._items().find((i) => i.id === id);
  }

  add(item: Item) {
    this._items.set([...this._items(), item]);
  }

  updateQuantity(id: string, quantity: number) {
    this._items.update((items) => items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  remove(id: string) {
    this._items.update((items) => items.filter((i) => i.id !== id));
  }
}
