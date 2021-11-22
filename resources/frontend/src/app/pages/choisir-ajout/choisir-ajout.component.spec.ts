import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoisirAjoutComponent } from './choisir-ajout.component';

describe('ChoisirAjoutComponent', () => {
  let component: ChoisirAjoutComponent;
  let fixture: ComponentFixture<ChoisirAjoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoisirAjoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoisirAjoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
