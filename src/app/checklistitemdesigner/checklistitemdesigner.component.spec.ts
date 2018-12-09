import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistitemdesignerComponent } from './checklistitemdesigner.component';

describe('ChecklistitemdesignerComponent', () => {
  let component: ChecklistitemdesignerComponent;
  let fixture: ComponentFixture<ChecklistitemdesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistitemdesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistitemdesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
