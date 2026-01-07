import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyCollectionReportComponent } from './yearly-collection-report.component';

describe('YearlyCollectionReportComponent', () => {
  let component: YearlyCollectionReportComponent;
  let fixture: ComponentFixture<YearlyCollectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyCollectionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
