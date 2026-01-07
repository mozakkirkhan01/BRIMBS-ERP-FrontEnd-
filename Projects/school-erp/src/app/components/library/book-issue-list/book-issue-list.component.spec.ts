import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIssueListComponent } from './book-issue-list.component';

describe('BookIssueListComponent', () => {
  let component: BookIssueListComponent;
  let fixture: ComponentFixture<BookIssueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookIssueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
