import { Routes } from '@angular/router';
import { Login } from './login/login';
import { MainScreen } from './main-screen/main-screen';
import { GroupBrowser } from './components/group-browser/group-browser';
import { CreateUser } from './components/create-user/create-user';
import { CreateGroup } from './components/create-group/create-group';

export const routes: Routes = [
    {
        path:"",
        component:Login,
        title:"Login",
    },
    {
        path:"main",
        component:MainScreen,
        title:"Main Page",
        children:[
            {
                path:"groupBrowser",
                component: GroupBrowser,
                title:"Group Browser"
            },
            {
                path:"createUser",
                component: CreateUser,
                title: "User Creator"
            },
            {
                path:"createGroup",
                component: CreateGroup,
                title: "Group Creator"
            }
        ]
    }
];
