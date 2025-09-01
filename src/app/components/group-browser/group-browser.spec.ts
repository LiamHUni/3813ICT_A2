import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBrowser } from './group-browser';

describe('GroupBrowser', () => {
  let component: GroupBrowser;
  let fixture: ComponentFixture<GroupBrowser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupBrowser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupBrowser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
