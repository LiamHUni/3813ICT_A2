import { Component, ViewChild, ElementRef } from '@angular/core';
import { GroupService } from '../../../services/group-service';
import { FormsModule } from '@angular/forms';
import { ChannelModal } from '../channel-modal/channel-modal';
import { AccountService } from '../../../services/account-service';
import { UserManager } from '../user-manager/user-manager';
import { Router } from '@angular/router';

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

  constructor(private groupService:GroupService, private accountService:AccountService, private router:Router){}

  ngOnInit(){
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
  }

  retrieveGroupInfo(id:number){
    this.groupService.getGroup(id).subscribe(
      res=>{
        this.groupInfo = res;
        if(this.groupInfo.channels){
          this.channel = this.groupInfo.channels[0];
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

  
  //No functionality required for assignment 1
  submit(){
    
  }
  
  openChannel(name:string){
    // console.log(name);
    this.viewingChat = true;
    this.channel = name;
  }

  createChannel(channelName: any){
    // console.log(channelName);
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
