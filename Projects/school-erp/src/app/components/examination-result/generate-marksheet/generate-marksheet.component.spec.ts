import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMarksheetComponent } from './generate-marksheet.component';

describe('GenerateMarksheetComponent', () => {
  let component: GenerateMarksheetComponent;
  let fixture: ComponentFixture<GenerateMarksheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateMarksheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateMarksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
