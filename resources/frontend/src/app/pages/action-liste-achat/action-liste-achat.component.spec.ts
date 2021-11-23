import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionListeAchatComponent } from './action-liste-achat.component';

describe('ActionListeAchatComponent', () => {
  let component: ActionListeAchatComponent;
  let fixture: ComponentFixture<ActionListeAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionListeAchatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionListeAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
