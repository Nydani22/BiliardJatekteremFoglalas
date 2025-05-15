import { TestBed } from '@angular/core/testing';

import { FoglalasokService } from './foglalasok.service';

describe('FoglalasokService', () => {
  let service: FoglalasokService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoglalasokService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
