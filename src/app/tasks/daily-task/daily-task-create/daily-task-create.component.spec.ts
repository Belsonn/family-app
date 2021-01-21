import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTaskCreateComponent } from './daily-task-create.component';

describe('DailyTaskCreateComponent', () => {
  let component: DailyTaskCreateComponent;
  let fixture: ComponentFixture<DailyTaskCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyTaskCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
