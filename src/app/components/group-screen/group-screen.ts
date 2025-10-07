import { Component, ViewChild, ElementRef } from '@angular/core';
import { GroupService } from '../../../services/group-service';
import { FormsModule } from '@angular/forms';
import { ChannelModal } from '../channel-modal/channel-modal';
import { AccountService } from '../../../services/account-service';
import { UserManager } from '../user-manager/user-manager';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket';

@Component({
  selector: 'app-group-screen',
  imports: [FormsModule, ChannelModal, UserManager],
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

  //Won't be used for part 1
  chatMessage: string = "";

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
  private initIoConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.getMessage()
      .subscribe((message:any)=>{
        this.messages.push(message);
      });
  }

  retrieveGroupInfo(id:number){
    this.groupService.getGroup(id).subscribe(
      res=>{
        this.groupInfo = res;
        if(this.groupInfo.channels){
          this.channel = this.groupInfo.channels[0];
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
    this.userAdmin = this.userInfo.groups.find((group: {name:string, id:number, admin:boolean})=>group.id === id)?.admin;
  }

  /*
  * Socket Functions
  */

  joinChannel(){
    const userMesInfo = {username: this.userInfo.username, pfpImage: this.userInfo.pfpImage};
    this.socketService.joinChannel(this.channel._id, userMesInfo);
  }
  
  // Send message
  submit(){
    const userMesInfo = {username: this.userInfo.username, pfpImage: this.userInfo.pfpImage};
    if(this.chatMessage){
      this.socketService.sendMessage(this.channel._id, userMesInfo, this.chatMessage);
      this.chatMessage = "";
    }else{
      console.log("No Message");
    }
  }
  
  leaveChannel(room:string){
    const userMesInfo = {username: this.userInfo.username, pfpImage: this.userInfo.pfpImage};
    this.socketService.leaveChannel(room, userMesInfo);
  }
  

  /*
  * Channel Management
  */
  
  openChannel(id:string){
    this.leaveChannel(this.channel._id);
    console.log("openChannel");
    this.channel = this.groupService.getChannel(id).subscribe(
      res=>{
        if(res){
          this.channel = res;
          this.messages = [];
          this.joinChannel();
        }
      }
    );
    this.viewingChat = true;
  }

  createChannel(channelName: any){
    this.groupService.createChannel(this.groupInfo.id, channelName).subscribe(
      res=>{
        if(res.valid){
          this.retrieveGroupInfo(Number(this.groupInfo.id));
        }
      }
    );
  }

  deleteChannel(){
    this.groupService.deleteChannel(this.groupInfo.id, this.channel._id).subscribe(
      res=>{
        if(res.valid){
          this.retrieveGroupInfo(Number(this.groupInfo.id));
        }
      }
    );
  }

  leaveGroup(){
    this.accountService.leaveGroup(this.groupInfo.id, this.userInfo.username).subscribe(
      res=>{
        if(res.valid){
          this.accountService.updateUserInfo(this.userInfo.username);
          this.router.navigateByUrl('/main/groupBrowser');
        }
      }
    )
  }
  
  deleteGroup(){
    this.groupService.deleteGroup(this.groupInfo.id).subscribe(
      res=>{
        if(res.valid){
          this.accountService.updateUserInfo(this.userInfo.username);
          this.router.navigateByUrl('/main/groupBrowser');
        }
      }
    )
  }


  userManagment(){
    this.viewingChat = false;
  }
}
