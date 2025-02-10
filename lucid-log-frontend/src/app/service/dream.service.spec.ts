import { TestBed } from '@angular/core/testing';

import { DreamService } from './dream.service';

describe('DreamService', () => {
  let service: DreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
