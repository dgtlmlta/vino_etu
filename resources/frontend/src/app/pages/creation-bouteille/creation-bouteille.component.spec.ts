import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationBouteilleComponent } from './creation-bouteille.component';

describe('CreationBouteilleComponent', () => {
  let component: CreationBouteilleComponent;
  let fixture: ComponentFixture<CreationBouteilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationBouteilleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationBouteilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
