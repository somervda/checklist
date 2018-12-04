import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistdesignerComponent } from './checklistdesigner.component';

describe('ChecklistdesignerComponent', () => {
  let component: ChecklistdesignerComponent;
  let fixture: ComponentFixture<ChecklistdesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistdesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistdesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
