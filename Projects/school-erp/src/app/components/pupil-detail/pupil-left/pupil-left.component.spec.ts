import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilLeftComponent } from './pupil-left.component';

describe('PupilLeftComponent', () => {
  let component: PupilLeftComponent;
  let fixture: ComponentFixture<PupilLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilLeftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
