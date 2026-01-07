import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportDurationComponent } from './transport-duration.component';

describe('TransportDurationComponent', () => {
  let component: TransportDurationComponent;
  let fixture: ComponentFixture<TransportDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportDurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
