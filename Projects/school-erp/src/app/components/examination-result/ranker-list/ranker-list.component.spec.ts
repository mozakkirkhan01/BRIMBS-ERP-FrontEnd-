import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankerListComponent } from './ranker-list.component';

describe('RankerListComponent', () => {
  let component: RankerListComponent;
  let fixture: ComponentFixture<RankerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
