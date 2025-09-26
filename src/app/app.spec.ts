import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

import { SwUpdate } from '@angular/service-worker';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [App], // standalone app
    providers: [
      provideRouter([]),
      {
        provide: SwUpdate,
        useValue: {
          isEnabled: false,
          versionUpdates: {
            subscribe: () => {
              console.warn('');
            },
          },
        },
      },
    ],
  }).compileComponents();
});

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
