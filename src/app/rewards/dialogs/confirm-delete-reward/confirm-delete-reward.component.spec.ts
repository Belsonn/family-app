import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteRewardComponent } from './confirm-delete-reward.component';

describe('ConfirmDeleteRewardComponent', () => {
  let component: ConfirmDeleteRewardComponent;
  let fixture: ComponentFixture<ConfirmDeleteRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteRewardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
