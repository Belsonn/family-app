import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTasksComponent } from './recent-tasks.component';

describe('RecentTasksComponent', () => {
  let component: RecentTasksComponent;
  let fixture: ComponentFixture<RecentTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
