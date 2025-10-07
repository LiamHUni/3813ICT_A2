import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io, Socket} from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private socket: Socket;
  constructor() {
    this.socket = io(SERVER_URL);
  }
  // constructor(private socket:Socket) {}

  initSocket(){
    this.socket = io(SERVER_URL);
    return ()=>{this.socket.disconnect();}
  }

  joinChannel(room:any, user:any){
    this.socket.emit('roomJoin', {room, user});
  }

  sendMessage(room:any, user:any, message:any){
    this.socket.emit('sendMessage', {room, user, message});
  }

  leaveChannel(room:any, user:any){
    this.socket.emit('roomLeave', {room, user});
  }

  getMessage(){
    return new Observable(observer=>{
      this.socket.on('message', (data) => {observer.next(data)
        });
    })
  }
}
