import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIssueComponent } from './product-issue.component';

describe('ProductIssueComponent', () => {
  let component: ProductIssueComponent;
  let fixture: ComponentFixture<ProductIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductIssueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
