import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-channel-modal',
  imports: [FormsModule],
  templateUrl: './channel-modal.html',
  styleUrl: './channel-modal.css'
})
export class ChannelModal {
  // @Output() modalEmit: EventEmitter<string> = new EventEmitter();
  @Output() modalChannelEmit = new EventEmitter<string>();

  channelName: string = "";

  createChannel(){
    if(this.channelName){
      this.modalChannelEmit.emit(this.channelName);
      this.channelName = "";
    }
  }
}
