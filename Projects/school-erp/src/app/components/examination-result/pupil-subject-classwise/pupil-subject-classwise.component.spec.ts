import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilSubjectClasswiseComponent } from './pupil-subject-classwise.component';

describe('PupilSubjectClasswiseComponent', () => {
  let component: PupilSubjectClasswiseComponent;
  let fixture: ComponentFixture<PupilSubjectClasswiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilSubjectClasswiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilSubjectClasswiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
