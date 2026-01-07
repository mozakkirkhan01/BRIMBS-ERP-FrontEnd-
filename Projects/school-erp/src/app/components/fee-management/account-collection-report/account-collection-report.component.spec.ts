import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCollectionReportComponent } from './account-collection-report.component';

describe('AccountCollectionReportComponent', () => {
  let component: AccountCollectionReportComponent;
  let fixture: ComponentFixture<AccountCollectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCollectionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
