import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilChargeComponent } from './pupil-charge.component';

describe('PupilChargeComponent', () => {
  let component: PupilChargeComponent;
  let fixture: ComponentFixture<PupilChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilChargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
