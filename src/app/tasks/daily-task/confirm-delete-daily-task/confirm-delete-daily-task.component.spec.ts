import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteDailyTaskComponent } from './confirm-delete-daily-task.component';

describe('ConfirmDeleteDailyTaskComponent', () => {
  let component: ConfirmDeleteDailyTaskComponent;
  let fixture: ComponentFixture<ConfirmDeleteDailyTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteDailyTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteDailyTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
