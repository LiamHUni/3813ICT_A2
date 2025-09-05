import { Component, ViewChild, ElementRef } from '@angular/core';
import { GroupService } from '../../../services/group-service';
import { FormsModule } from '@angular/forms';
import { ChannelModal } from '../channel-modal/channel-modal';

@Component({
  selector: 'app-group-screen',
  imports: [FormsModule, ChannelModal],
  templateUrl: './group-screen.html',
  styleUrl: './group-screen.css'
})


export class GroupScreen {
  //Gives defualt name to prevent error message in quick loading time
  groupInfo:object|any = {name:"loading"};
  channel: string = "temp";

  userAdmin: boolean = false;

  //Won't be used for part 1
  chatMessage: string = "";

  modal: any;

  constructor(private groupService:GroupService){}

  ngOnInit(){
    //Subscribes to observer to recieve group id from main-screen.ts
    this.groupService.curGroup$.subscribe(data=>{
      if(data){
        localStorage.setItem('currentGroup', data);
        this.retrieveGroupInfo(Number(data));
        this.determineIfAdmin(Number(data));
      }else{
        const id = localStorage.getItem('currentGroup');
        this.retrieveGroupInfo(Number(id));
        this.determineIfAdmin(Number(id));
      }
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
    let userInfo:any = localStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    //Finds group in user group array, checks admin value
    this.userAdmin = userInfo.groups.find((group: {name:string, id:number, admin:boolean})=>group.id === id)?.admin;
  }

  openChannel(name:string){
    console.log(name);
    this.channel = name;
  }

  //No functionality required for assignment 1
  submit(){

  }

  createChannel(channelName: any){
    console.log(channelName);
    this.groupService.createChannel(this.groupInfo.id, channelName).subscribe(
      res=>{
        if(res.valid){
          this.retrieveGroupInfo(Number(this.groupInfo.id));
        }
      }
    );
  }
}
