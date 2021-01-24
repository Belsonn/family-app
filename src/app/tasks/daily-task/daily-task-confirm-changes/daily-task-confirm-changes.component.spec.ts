import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTaskConfirmChangesComponent } from './daily-task-confirm-changes.component';

describe('DailyTaskConfirmChangesComponent', () => {
  let component: DailyTaskConfirmChangesComponent;
  let fixture: ComponentFixture<DailyTaskConfirmChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyTaskConfirmChangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTaskConfirmChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
