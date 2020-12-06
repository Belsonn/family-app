import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickUserComponent } from './pick-user.component';

describe('PickUserComponent', () => {
  let component: PickUserComponent;
  let fixture: ComponentFixture<PickUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
