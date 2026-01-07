import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeAdmissionHeadComponent } from './fee-admission-head.component';

describe('FeeAdmissionHeadComponent', () => {
  let component: FeeAdmissionHeadComponent;
  let fixture: ComponentFixture<FeeAdmissionHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeAdmissionHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeAdmissionHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
