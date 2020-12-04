import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamecreatorComponent } from './namecreator.component';

describe('NamecreatorComponent', () => {
  let component: NamecreatorComponent;
  let fixture: ComponentFixture<NamecreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NamecreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NamecreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
