import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingListComponent } from './closing-list.component';

describe('ClosingListComponent', () => {
  let component: ClosingListComponent;
  let fixture: ComponentFixture<ClosingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
