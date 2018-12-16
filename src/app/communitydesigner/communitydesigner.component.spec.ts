import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitydesignerComponent } from './communitydesigner.component';

describe('CommunitydesignerComponent', () => {
  let component: CommunitydesignerComponent;
  let fixture: ComponentFixture<CommunitydesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitydesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitydesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
