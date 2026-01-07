import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportPupilComponent } from './transport-pupil.component';

describe('TransportPupilComponent', () => {
  let component: TransportPupilComponent;
  let fixture: ComponentFixture<TransportPupilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportPupilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportPupilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
