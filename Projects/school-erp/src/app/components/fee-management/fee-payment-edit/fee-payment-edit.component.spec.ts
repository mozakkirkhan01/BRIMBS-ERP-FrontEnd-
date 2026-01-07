import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePaymentEditComponent } from './fee-payment-edit.component';

describe('FeePaymentEditComponent', () => {
  let component: FeePaymentEditComponent;
  let fixture: ComponentFixture<FeePaymentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeePaymentEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeePaymentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
