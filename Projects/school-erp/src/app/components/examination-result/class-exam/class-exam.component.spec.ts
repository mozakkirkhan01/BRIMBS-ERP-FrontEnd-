import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassExamComponent } from './class-exam.component';

describe('ClassExamComponent', () => {
  let component: ClassExamComponent;
  let fixture: ComponentFixture<ClassExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassExamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
