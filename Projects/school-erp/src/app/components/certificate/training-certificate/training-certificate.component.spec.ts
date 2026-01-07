import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCertificateComponent } from './training-certificate.component';

describe('TrainingCertificateComponent', () => {
  let component: TrainingCertificateComponent;
  let fixture: ComponentFixture<TrainingCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingCertificateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
