import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsMainComponent } from './rewards-main.component';

describe('RewardsMainComponent', () => {
  let component: RewardsMainComponent;
  let fixture: ComponentFixture<RewardsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardsMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
