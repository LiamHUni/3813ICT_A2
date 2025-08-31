import { Component } from '@angular/core';
import { GroupBrowser } from '../group-browser/group-browser';

@Component({
  selector: 'app-main-screen',
  imports: [GroupBrowser],
  templateUrl: './main-screen.html',
  styleUrl: './main-screen.css'
})
export class MainScreen {

}
