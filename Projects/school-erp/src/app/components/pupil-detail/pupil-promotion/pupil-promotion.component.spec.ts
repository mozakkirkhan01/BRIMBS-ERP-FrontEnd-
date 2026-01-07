import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilPromotionComponent } from './pupil-promotion.component';

describe('PupilPromotionComponent', () => {
  let component: PupilPromotionComponent;
  let fixture: ComponentFixture<PupilPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilPromotionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PupilPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
