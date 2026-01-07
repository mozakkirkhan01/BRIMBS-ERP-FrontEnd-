import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryBarCodeComponent } from './library-bar-code.component';

describe('LibraryBarCodeComponent', () => {
  let component: LibraryBarCodeComponent;
  let fixture: ComponentFixture<LibraryBarCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryBarCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryBarCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
