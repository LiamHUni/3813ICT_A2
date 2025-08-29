import { Routes } from '@angular/router';
import { Login } from './login/login';
import { MainScreen } from './main-screen/main-screen';

export const routes: Routes = [
    {
        path:"test",
        component:Login,
        title:"Login",
    },
    {
        path:"",
        component:MainScreen,
        title:"Main Page",
    }
];
