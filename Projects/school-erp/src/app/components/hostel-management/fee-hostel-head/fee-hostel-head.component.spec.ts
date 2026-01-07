import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeHostelHeadComponent } from './fee-hostel-head.component';

describe('FeeHostelHeadComponent', () => {
  let component: FeeHostelHeadComponent;
  let fixture: ComponentFixture<FeeHostelHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeHostelHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeHostelHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
