import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneBarComponent } from './phone-bar.component';

describe('PhoneBarComponent', () => {
  let component: PhoneBarComponent;
  let fixture: ComponentFixture<PhoneBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
