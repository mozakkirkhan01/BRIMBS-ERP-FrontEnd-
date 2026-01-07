import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelPupilComponent } from './hostel-pupil.component';

describe('HostelPupilComponent', () => {
  let component: HostelPupilComponent;
  let fixture: ComponentFixture<HostelPupilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelPupilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelPupilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
