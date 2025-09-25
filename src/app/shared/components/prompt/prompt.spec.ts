import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwaPromptComponent } from './prompt';

describe('Prompt', () => {
  let component: PwaPromptComponent;
  let fixture: ComponentFixture<PwaPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwaPromptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PwaPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
