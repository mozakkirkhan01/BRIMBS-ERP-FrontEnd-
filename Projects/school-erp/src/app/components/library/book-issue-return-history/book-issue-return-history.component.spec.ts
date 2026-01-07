import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIssueReturnHistoryComponent } from './book-issue-return-history.component';

describe('BookIssueReturnHistoryComponent', () => {
  let component: BookIssueReturnHistoryComponent;
  let fixture: ComponentFixture<BookIssueReturnHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookIssueReturnHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookIssueReturnHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
