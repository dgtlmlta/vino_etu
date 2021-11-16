import { TestBed } from '@angular/core/testing';

import { ElementsActifsService } from './elements-actifs.service';

describe('ElementsActifsService', () => {
  let service: ElementsActifsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementsActifsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
