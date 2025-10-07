import { Routes } from '@angular/router';
import { Login } from './login/login';
import { MainScreen } from './main-screen/main-screen';
import { GroupBrowser } from './components/group-browser/group-browser';
import { CreateUser } from './components/create-user/create-user';
import { CreateGroup } from './components/create-group/create-group';
import { GroupScreen } from './components/group-screen/group-screen';
import { UserManager } from './components/user-manager/user-manager';
import { Profile } from './components/profile/profile';

import { signedInGuard } from '../guards/signed-in-guard';
import { signedOutGuard } from '../guards/signed-out-guard';

export const routes: Routes = [
    {
        path:"",
        component:Login,
        title:"Login",
        canActivate:[signedOutGuard]
    },
    {
        path:"main",
        component:MainScreen,
        title:"Main Page",
        canActivate: [signedInGuard],
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
            },
            {
                path:"groupChat",
                component: GroupScreen,
                title: "Group Chat",
            },
            {
                path:"userManagment",
                component: UserManager,
                title: "UserManager"
            },
            {
                path:"profile",
                component: Profile,
                title: "Profile"
            }
        ]
    }
];
