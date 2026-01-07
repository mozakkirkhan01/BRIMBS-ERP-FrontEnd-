import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBookComponent } from './purchase-book.component';

describe('PurchaseBookComponent', () => {
  let component: PurchaseBookComponent;
  let fixture: ComponentFixture<PurchaseBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
