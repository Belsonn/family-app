import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsUnlockedComponent } from './rewards-unlocked.component';

describe('RewardsUnlockedComponent', () => {
  let component: RewardsUnlockedComponent;
  let fixture: ComponentFixture<RewardsUnlockedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardsUnlockedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsUnlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
