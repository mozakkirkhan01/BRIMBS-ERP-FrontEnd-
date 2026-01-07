import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCertificateListComponent } from './training-certificate-list.component';

describe('TrainingCertificateListComponent', () => {
  let component: TrainingCertificateListComponent;
  let fixture: ComponentFixture<TrainingCertificateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingCertificateListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingCertificateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
