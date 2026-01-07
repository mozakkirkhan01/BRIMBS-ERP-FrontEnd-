import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullMarkComponent } from './full-mark.component';

describe('FullMarkComponent', () => {
  let component: FullMarkComponent;
  let fixture: ComponentFixture<FullMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullMarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
