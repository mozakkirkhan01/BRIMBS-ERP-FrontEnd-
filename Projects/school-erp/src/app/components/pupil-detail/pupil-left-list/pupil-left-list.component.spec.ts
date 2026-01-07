import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilLeftListComponent } from './pupil-left-list.component';

describe('PupilLeftListComponent', () => {
  let component: PupilLeftListComponent;
  let fixture: ComponentFixture<PupilLeftListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilLeftListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilLeftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
