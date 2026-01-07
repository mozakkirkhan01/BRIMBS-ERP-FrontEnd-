import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseCounterComponent } from './close-counter.component';

describe('CloseCounterComponent', () => {
  let component: CloseCounterComponent;
  let fixture: ComponentFixture<CloseCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseCounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
