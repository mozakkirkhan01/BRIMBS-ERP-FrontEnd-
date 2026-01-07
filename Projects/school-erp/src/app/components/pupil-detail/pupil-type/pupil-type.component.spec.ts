import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilTypeComponent } from './pupil-type.component';

describe('PupilTypeComponent', () => {
  let component: PupilTypeComponent;
  let fixture: ComponentFixture<PupilTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
