import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDueListComponent } from './fee-due-list.component';

describe('FeeDueListComponent', () => {
  let component: FeeDueListComponent;
  let fixture: ComponentFixture<FeeDueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeDueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
