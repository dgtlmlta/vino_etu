import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAchatsComponent } from './liste-achats.component';

describe('ListeAchatsComponent', () => {
  let component: ListeAchatsComponent;
  let fixture: ComponentFixture<ListeAchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeAchatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
