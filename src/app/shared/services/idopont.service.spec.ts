import { TestBed } from '@angular/core/testing';

import { IdopontService } from './idopont.service';

describe('IdopontService', () => {
  let service: IdopontService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdopontService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
