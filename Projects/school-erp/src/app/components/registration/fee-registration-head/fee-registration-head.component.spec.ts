import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeRegistrationHeadComponent } from './fee-registration-head.component';

describe('FeeRegistrationHeadComponent', () => {
  let component: FeeRegistrationHeadComponent;
  let fixture: ComponentFixture<FeeRegistrationHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeRegistrationHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeRegistrationHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
