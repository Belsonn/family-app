import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRewardComponent } from './confirm-reward.component';

describe('ConfirmRewardComponent', () => {
  let component: ConfirmRewardComponent;
  let fixture: ComponentFixture<ConfirmRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRewardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
