import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MychecklistsComponent } from './mychecklists.component';

describe('MychecklistsComponent', () => {
  let component: MychecklistsComponent;
  let fixture: ComponentFixture<MychecklistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MychecklistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MychecklistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
