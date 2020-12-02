import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NofamilyComponent } from './nofamily.component';

describe('NofamilyComponent', () => {
  let component: NofamilyComponent;
  let fixture: ComponentFixture<NofamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NofamilyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NofamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
