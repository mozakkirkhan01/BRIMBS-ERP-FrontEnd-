import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherRemarksEntryComponent } from './teacher-remarks-entry.component';

describe('TeacherRemarksEntryComponent', () => {
  let component: TeacherRemarksEntryComponent;
  let fixture: ComponentFixture<TeacherRemarksEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherRemarksEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherRemarksEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
