import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilAttendanceComponent } from './pupil-attendance.component';

describe('PupilAttendanceComponent', () => {
  let component: PupilAttendanceComponent;
  let fixture: ComponentFixture<PupilAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
