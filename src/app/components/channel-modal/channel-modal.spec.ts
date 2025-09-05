import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelModal } from './channel-modal';

describe('ChannelModal', () => {
  let component: ChannelModal;
  let fixture: ComponentFixture<ChannelModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
