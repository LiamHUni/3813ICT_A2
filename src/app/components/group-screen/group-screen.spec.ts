import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupScreen } from './group-screen';

describe('GroupScreen', () => {
  let component: GroupScreen;
  let fixture: ComponentFixture<GroupScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
