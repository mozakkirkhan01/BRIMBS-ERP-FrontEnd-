import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTransportHeadComponent } from './fee-transport-head.component';

describe('FeeTransportHeadComponent', () => {
  let component: FeeTransportHeadComponent;
  let fixture: ComponentFixture<FeeTransportHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeTransportHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeTransportHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
