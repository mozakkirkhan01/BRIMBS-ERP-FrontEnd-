import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelDurationComponent } from './hostel-duration.component';

describe('HostelDurationComponent', () => {
  let component: HostelDurationComponent;
  let fixture: ComponentFixture<HostelDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelDurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
