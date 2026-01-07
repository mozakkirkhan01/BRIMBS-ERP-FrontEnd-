import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilWaiveOffComponent } from './pupil-waive-off.component';

describe('PupilWaiveOffComponent', () => {
  let component: PupilWaiveOffComponent;
  let fixture: ComponentFixture<PupilWaiveOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilWaiveOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilWaiveOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
