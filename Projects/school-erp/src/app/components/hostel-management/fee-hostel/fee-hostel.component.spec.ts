import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeHostelComponent } from './fee-hostel.component';

describe('FeeHostelComponent', () => {
  let component: FeeHostelComponent;
  let fixture: ComponentFixture<FeeHostelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeHostelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeHostelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
