import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilSubjectComponent } from './pupil-subject.component';

describe('PupilSubjectComponent', () => {
  let component: PupilSubjectComponent;
  let fixture: ComponentFixture<PupilSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
