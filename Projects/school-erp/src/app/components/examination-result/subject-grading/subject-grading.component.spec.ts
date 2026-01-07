import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectGradingComponent } from './subject-grading.component';

describe('SubjectGradingComponent', () => {
  let component: SubjectGradingComponent;
  let fixture: ComponentFixture<SubjectGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectGradingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
