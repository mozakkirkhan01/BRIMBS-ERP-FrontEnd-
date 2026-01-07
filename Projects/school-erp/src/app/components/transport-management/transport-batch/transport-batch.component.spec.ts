import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBatchComponent } from './transport-batch.component';

describe('TransportBatchComponent', () => {
  let component: TransportBatchComponent;
  let fixture: ComponentFixture<TransportBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportBatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
