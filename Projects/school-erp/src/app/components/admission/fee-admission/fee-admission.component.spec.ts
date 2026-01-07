import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeAdmissionComponent } from './fee-admission.component';

describe('FeeAdmissionComponent', () => {
  let component: FeeAdmissionComponent;
  let fixture: ComponentFixture<FeeAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeAdmissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
