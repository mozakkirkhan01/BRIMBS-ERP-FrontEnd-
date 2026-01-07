import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeRegistrationComponent } from './fee-registration.component';

describe('FeeRegistrationComponent', () => {
  let component: FeeRegistrationComponent;
  let fixture: ComponentFixture<FeeRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
