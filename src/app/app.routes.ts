import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
export const routes: Routes = [
    {path : '' , component:LoginComponent},
    {path : 'dashboard' , component:DashboardComponent, canActivate:[authGuard]}
];
