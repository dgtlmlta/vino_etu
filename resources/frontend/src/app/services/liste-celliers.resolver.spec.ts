import { TestBed } from '@angular/core/testing';

import { ListeCelliersResolver } from './liste-celliers.resolver';

describe('ListeCelliersResolver', () => {
  let resolver: ListeCelliersResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ListeCelliersResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
