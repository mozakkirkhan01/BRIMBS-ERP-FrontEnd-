import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCertificateListComponent } from './transfer-certificate-list.component';

describe('TransferCertificateListComponent', () => {
  let component: TransferCertificateListComponent;
  let fixture: ComponentFixture<TransferCertificateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferCertificateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferCertificateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
