import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeClassHeadComponent } from './fee-class-head.component';

describe('FeeClassHeadComponent', () => {
  let component: FeeClassHeadComponent;
  let fixture: ComponentFixture<FeeClassHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeClassHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeClassHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
