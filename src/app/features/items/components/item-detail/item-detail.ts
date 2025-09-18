import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../services/item';
import { Item } from '../../models/item';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (item) {
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

  item: Item | undefined;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.item = this.service.getById(id);
    }
  }
}
