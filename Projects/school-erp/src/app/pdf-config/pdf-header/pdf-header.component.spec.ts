import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfHeaderComponent } from './pdf-header.component';

describe('PdfHeaderComponent', () => {
  let component: PdfHeaderComponent;
  let fixture: ComponentFixture<PdfHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
