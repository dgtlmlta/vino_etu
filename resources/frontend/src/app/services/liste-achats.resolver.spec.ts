import { TestBed } from '@angular/core/testing';

import { ListeAchatsResolver } from './liste-achats.resolver';

describe('ListeAchatsResolver', () => {
  let resolver: ListeAchatsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ListeAchatsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
