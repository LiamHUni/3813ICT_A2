import { Component, ViewChild, ElementRef } from '@angular/core';
import { GroupService } from '../../../services/group-service';
import { FormsModule } from '@angular/forms';
import { ChannelModal } from '../channel-modal/channel-modal';
import { AccountService } from '../../../services/account-service';
import { UserManager } from '../user-manager/user-manager';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-screen',
  imports: [FormsModule, CommonModule,ChannelModal, UserManager],
  templateUrl: './group-screen.html',
  styleUrl: './group-screen.css'
})


export class GroupScreen {
  //Gives defualt name to prevent error message in quick loading time
  groupInfo:object|any = {name:"loading"};
  channel: object|any = "temp";

  userInfo: any;
  userAdmin: boolean = false;

  viewingChat: boolean = true;

  chatMessage: string = "";
  chatImage: string = "";

  modal: any;

  messages: any = [];

  ioConnection:any;

  constructor(private groupService:GroupService, private accountService:AccountService, private router:Router, private socketService:SocketService){}

  ngOnInit(){
    this.messages = [];
    //Subscribes to observer to recieve group id from main-screen.ts
    this.groupService.curGroup$.subscribe(data=>{
      if(data){
        localStorage.setItem('currentGroup', data);
        this.retrieveGroupInfo(Number(data));
        this.determineIfAdmin(Number(data));
      }else{
        //Allows group to load if page is reloaded
        const id = localStorage.getItem('currentGroup');
        this.retrieveGroupInfo(Number(id));
        this.determineIfAdmin(Number(id));
      }
      this.viewingChat = true;
    });
    this.initIoConnection();
  }


  /*
  * Inital Functions
  */

  // Initiates connection to server sockets
  private initIoConnection(){
    this.socketService.initSocket();
    // Determines functions after recieving messages
    this.ioConnection = this.socketService.getMessage()
      .subscribe((message:any)=>{
        // Push new message to messages array
        this.messages.push(message);
      });
  }

  // Retreieve all information about group
  retrieveGroupInfo(id:number){
    this.groupService.getGroup(id).subscribe(
      res=>{
        // Set group info to res
        this.groupInfo = res;
        // If group info has channels
        if(this.groupInfo.channels){
          // Sets current channel to first channel in array
          this.channel = this.groupInfo.channels[0];
          // Open first channel, allows loading extra information
          this.openChannel(this.channel._id);
        }else{
          this.channel = "";
        }
      }
    );
  }

  //Finding if user is admin of group
  determineIfAdmin(id:number){
    //Get user info from storage
    const userInfoTemp = localStorage.getItem('userInfo');
    this.userInfo = userInfoTemp ? JSON.parse(userInfoTemp): null;
    //Finds group in user group array, checks admin value
    this.userAdmin = this.userInfo.roles.includes("superAdmin") || this.userInfo.roles.includes("groupAdmin");
  }

  /*
  * Socket Functions
  */

  // Request to server socket to join room using channel _id, creates join message
  joinChannel(){
    const userMesInfo = {username: this.userInfo.username, pfpImage: this.userInfo.pfpImage};
    this.socketService.joinChannel(this.channel._id, userMesInfo);
  }
  
  // Send message to server socket
  submit(){
    // Gets only required user information
    const userMesInfo = {username: this.userInfo.username, pfpImage: this.userInfo.pfpImage};
    // If there is a chat message entered
    if(this.chatMessage){
      // Sends channel _id, user info, chat message and image to socket service to send to server socket
      // to emit to all users in channel _id room
      this.socketService.sendMessage(this.channel._id, userMesInfo, this.chatMessage, this.chatImage);
      // Sends same information to server to add to mongodb database
      this.groupService.addMessage(this.channel._id, this.userInfo.username, this.chatMessage, this.chatImage).subscribe(
        res=>{
          if(res.valid){
            console.log("message saved");
          }
        }
      );
      // Reset chat message and image
      this.chatMessage = "";
      this.chatImage = "";
    }else{
      console.log("No Message");
    }
  }
  
  // Request to server socket to leave room using channel _id, creates leave message
  leaveChannel(room:string){
    const userMesInfo = {username: this.userInfo.username, pfpImage: this.userInfo.pfpImage};
    this.socketService.leaveChannel(room, userMesInfo);
  }

  /*
  * Image fuctions
  */

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    // Once image is changed into Base64 string, sets chat image to value
    reader.onload = () => {
      this.chatImage = reader.result as string;
    };

    reader.onerror = error => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file); // Converts to Base64
  }

  // Clears chat image Base64 string
  removeImage(){
    this.chatImage = "";
  }

  /*
  * Channel Management
  */
  
  openChannel(id:string){
    // Calls leave channel function to request room leave
    this.leaveChannel(this.channel._id);

    // Gets new channel information
    this.channel = this.groupService.getChannel(id).subscribe(
      res=>{
        if(res){
          // Sets channel information to returned value
          this.channel = res;

          // Sets messages array to channel messages retrieved from database
          this.messages = this.channel.messages;
          // Calls join channel function to request room join
          this.joinChannel();
        }
      }
    );
    this.viewingChat = true;
  }

  // Requests channel creation through group service
  createChannel(channelName: any){
    this.groupService.createChannel(this.groupInfo.id, channelName).subscribe(
      res=>{
        if(res.valid){
          // Reload group information, updates channel display
          this.retrieveGroupInfo(Number(this.groupInfo.id));
        }
      }
    );
  }

  // Request channel deletion through group service
  deleteChannel(){
    this.groupService.deleteChannel(this.groupInfo.id, this.channel._id).subscribe(
      res=>{
        if(res.valid){
          // Reload group information, updates channel display
          this.retrieveGroupInfo(Number(this.groupInfo.id));
        }
      }
    );
  }

  // Request to leave group throguh account service
  leaveGroup(){
    this.accountService.leaveGroup(this.groupInfo.id, this.userInfo.username).subscribe(
      res=>{
        if(res.valid){
          // Updates user information to get updated group list
          this.accountService.updateUserInfo(this.userInfo.username);
          // Returns user to group browser page
          this.router.navigateByUrl('/main/groupBrowser');
        }
      }
    )
  }
  
  // Request group deletion through group service
  deleteGroup(){
    this.groupService.deleteGroup(this.groupInfo.id).subscribe(
      res=>{
        if(res.valid){
          // Updates user information to get updated group list
          this.accountService.updateUserInfo(this.userInfo.username);
          // Returns user to group browser page
          this.router.navigateByUrl('/main/groupBrowser');
        }
      }
    )
  }

  // Allows user management page to be displayed
  userManagment(){
    this.viewingChat = false;
  }
}
