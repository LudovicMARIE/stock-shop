import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemForm } from './create-item-form';

describe('CreateItemForm', () => {
  let component: CreateItemForm;
  let fixture: ComponentFixture<CreateItemForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateItemForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateItemForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
