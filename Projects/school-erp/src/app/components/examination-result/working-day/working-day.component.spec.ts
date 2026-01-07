import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingDayComponent } from './working-day.component';

describe('WorkingDayComponent', () => {
  let component: WorkingDayComponent;
  let fixture: ComponentFixture<WorkingDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
