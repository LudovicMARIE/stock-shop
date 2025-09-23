import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from 'src/app/features/items/models/item';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="itemForm"
      (ngSubmit)="onSubmit()"
      class="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md mb-8"
    >
      <div class="mb-4">
        <label for="name" class="block mb-1 font-medium">Name</label>
        <input id="name" formControlName="name" type="text" class="w-full border rounded p-2" />
        @if (itemForm.get('name')?.invalid && itemForm.get('name')?.touched) {
          <p class="text-red-500 text-sm">Name is required</p>
        }
      </div>

      <div class="mb-4">
        <label for="description" class="block mb-1 font-medium">Description</label>
        <textarea
          id="description"
          formControlName="description"
          class="w-full border rounded p-2"
        ></textarea>
        @if (itemForm.get('description')?.invalid && itemForm.get('description')?.touched) {
          <p class="text-red-500 text-sm">Description must be at least 10 characters</p>
        }
      </div>

      <div class="mb-4">
        <label for="photo" class="block mb-1 font-medium">Photo URL</label>
        <input id="photo" formControlName="photo" type="url" class="w-full border rounded p-2" />
        @if (itemForm.get('photo')?.invalid && itemForm.get('photo')?.touched) {
          <p class="text-red-500 text-sm">Must be a valid URL</p>
        }
      </div>

      <div class="mb-4">
        <label for="quantity" class="block mb-1 font-medium">Quantity</label>
        <input
          id="quantity"
          formControlName="quantity"
          type="number"
          class="w-full border rounded p-2"
        />
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
          <span>{{ submitLabel }}</span>
        } @else {
          <span class="animate-pulse">Processing...</span>
        }
      </button>
    </form>
  `,
})
export class CreateItemForm {
  private fb = inject(FormBuilder);

  @Output() save = new EventEmitter<Item>();

  loading = false;
  submitLabel = 'Create Item';

  itemForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    photo: ['', Validators.pattern(/https?:\/\/.+/)],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  onSubmit() {
    if (this.itemForm.invalid) return;

    const newItem: Item = {
      id: Date.now().toString(),
      name: this.itemForm.value.name ?? '',
      description: this.itemForm.value.description ?? '',
      photo: this.itemForm.value.photo ?? undefined,
      quantity: this.itemForm.value.quantity ?? 0,
    };

    this.save.emit(newItem);
    this.itemForm.reset({ quantity: 0 });
  }
}
