import { TestBed } from '@angular/core/testing';

import { Pwa } from './pwa';

describe('Pwa', () => {
  let service: Pwa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pwa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
