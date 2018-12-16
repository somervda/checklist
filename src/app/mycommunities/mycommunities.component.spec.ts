import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycommunitiesComponent } from './mycommunities.component';

describe('MycommunitiesComponent', () => {
  let component: MycommunitiesComponent;
  let fixture: ComponentFixture<MycommunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycommunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
