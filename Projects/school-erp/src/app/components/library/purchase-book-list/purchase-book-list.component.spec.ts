import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBookListComponent } from './purchase-book-list.component';

describe('PurchaseBookListComponent', () => {
  let component: PurchaseBookListComponent;
  let fixture: ComponentFixture<PurchaseBookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseBookListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
