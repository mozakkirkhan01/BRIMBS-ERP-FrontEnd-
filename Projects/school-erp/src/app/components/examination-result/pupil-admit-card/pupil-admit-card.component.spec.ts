import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilAdmitCardComponent } from './pupil-admit-card.component';

describe('PupilAdmitCardComponent', () => {
  let component: PupilAdmitCardComponent;
  let fixture: ComponentFixture<PupilAdmitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilAdmitCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilAdmitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
