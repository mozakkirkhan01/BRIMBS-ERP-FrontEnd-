import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardListComponent } from './admit-card-list.component';

describe('AdmitCardListComponent', () => {
  let component: AdmitCardListComponent;
  let fixture: ComponentFixture<AdmitCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmitCardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmitCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
