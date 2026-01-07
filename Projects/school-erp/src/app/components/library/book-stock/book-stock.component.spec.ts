import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookStockComponent } from './book-stock.component';

describe('BookStockComponent', () => {
  let component: BookStockComponent;
  let fixture: ComponentFixture<BookStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
