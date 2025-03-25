import { TestBed } from '@angular/core/testing';

import { RearrangeSentencesService } from './rearrange-sentences.service';

describe('RearrangeSentencesService', () => {
  let service: RearrangeSentencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RearrangeSentencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
