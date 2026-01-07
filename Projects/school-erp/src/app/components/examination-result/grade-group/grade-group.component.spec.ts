import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeGroupComponent } from './grade-group.component';

describe('GradeGroupComponent', () => {
  let component: GradeGroupComponent;
  let fixture: ComponentFixture<GradeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
