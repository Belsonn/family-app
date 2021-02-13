import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenPermissionComponent } from './children-permission.component';

describe('ChildrenPermissionComponent', () => {
  let component: ChildrenPermissionComponent;
  let fixture: ComponentFixture<ChildrenPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildrenPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
