import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIssueListComponent } from './product-issue-list.component';

describe('ProductIssueListComponent', () => {
  let component: ProductIssueListComponent;
  let fixture: ComponentFixture<ProductIssueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductIssueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
