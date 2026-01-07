import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePaymentListComponent } from './fee-payment-list.component';

describe('FeePaymentListComponent', () => {
  let component: FeePaymentListComponent;
  let fixture: ComponentFixture<FeePaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeePaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeePaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
