import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePaymentListPupilwiseComponent } from './fee-payment-list-pupilwise.component';

describe('FeePaymentListPupilwiseComponent', () => {
  let component: FeePaymentListPupilwiseComponent;
  let fixture: ComponentFixture<FeePaymentListPupilwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeePaymentListPupilwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeePaymentListPupilwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
