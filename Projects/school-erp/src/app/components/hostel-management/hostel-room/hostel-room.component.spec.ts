import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelRoomComponent } from './hostel-room.component';

describe('HostelRoomComponent', () => {
  let component: HostelRoomComponent;
  let fixture: ComponentFixture<HostelRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
