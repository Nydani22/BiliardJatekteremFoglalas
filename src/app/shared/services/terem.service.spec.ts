import { TestBed } from '@angular/core/testing';

import { TeremService } from './terem.service';

describe('TeremService', () => {
  let service: TeremService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeremService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
