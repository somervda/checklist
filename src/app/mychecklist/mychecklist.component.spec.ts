import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MychecklistComponent } from './mychecklist.component';

describe('MychecklistComponent', () => {
  let component: MychecklistComponent;
  let fixture: ComponentFixture<MychecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MychecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MychecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
