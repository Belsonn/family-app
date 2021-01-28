import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsCreateComponent } from './rewards-create.component';

describe('RewardsCreateComponent', () => {
  let component: RewardsCreateComponent;
  let fixture: ComponentFixture<RewardsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
