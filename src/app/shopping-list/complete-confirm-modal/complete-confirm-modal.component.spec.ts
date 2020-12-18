import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteConfirmModalComponent } from './complete-confirm-modal.component';

describe('CompleteConfirmModalComponent', () => {
  let component: CompleteConfirmModalComponent;
  let fixture: ComponentFixture<CompleteConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteConfirmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
