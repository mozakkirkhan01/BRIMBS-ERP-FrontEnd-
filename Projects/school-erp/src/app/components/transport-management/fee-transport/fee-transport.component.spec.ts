import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTransportComponent } from './fee-transport.component';

describe('FeeTransportComponent', () => {
  let component: FeeTransportComponent;
  let fixture: ComponentFixture<FeeTransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeTransportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
