import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousPaymentComponent } from './miscellaneous-payment.component';

describe('MiscellaneousPaymentComponent', () => {
  let component: MiscellaneousPaymentComponent;
  let fixture: ComponentFixture<MiscellaneousPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiscellaneousPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
