import { Component } from '@angular/core';
import { GroupService } from '../../../services/group-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-screen',
  imports: [FormsModule],
  templateUrl: './group-screen.html',
  styleUrl: './group-screen.css'
})


export class GroupScreen {
  //Gives defualt name to prevent error message in quick loading time
  groupInfo:object|any = {name:"loading"};
  channel: string = "temp";

  chatMessage: string = "";

  constructor(private groupService:GroupService){}


  ngOnInit(){
    //Subscribes to observer to recieve group id from main-screen.ts
    this.groupService.curGroup$.subscribe(data=>{
      if(data){
        localStorage.setItem('currentGroup', data);
        this.retrieveGroupInfo(Number(data));
      }else{
        const id = localStorage.getItem('currentGroup');
        this.retrieveGroupInfo(Number(id));
      }
    });
    if(!this.groupInfo){
      console.log("moving back");
    }
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

  openChannel(name:string){
    console.log(name);
    this.channel = name;
  }

  //No functionality required for assignment 1
  submit(){

  }
}