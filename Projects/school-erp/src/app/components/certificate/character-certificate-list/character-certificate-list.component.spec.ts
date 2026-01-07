import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCertificateListComponent } from './character-certificate-list.component';

describe('CharacterCertificateListComponent', () => {
  let component: CharacterCertificateListComponent;
  let fixture: ComponentFixture<CharacterCertificateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterCertificateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterCertificateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
