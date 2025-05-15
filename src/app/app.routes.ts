import { Routes } from '@angular/router';
import { FooldalComponent } from './pages/fooldal/fooldal.component';
import { FoglalasComponent } from './pages/foglalas/foglalas.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { SignupComponent } from './pages/signup/signup.component';
import { adminGuard, authGuard, publicGuard } from './shared/guards/auth/auth.guard';
import { AdminComponent } from './pages/admin/admin/admin.component';

export const routes: Routes = [
    {path: 'fooldal', component: FooldalComponent},
    {path: 'foglalas', component: FoglalasComponent, canActivate: [authGuard]},
    {path: 'profil', component: ProfilComponent, canActivate: [authGuard]},
    {path: 'login', component: LoginComponent, canActivate: [publicGuard]},
    {path: 'signup', component: SignupComponent, canActivate: [publicGuard]},
    {path: 'admin', component: AdminComponent, canActivate: [adminGuard]},
    {path: '', redirectTo: 'fooldal', pathMatch:"full" },
    {path: '**', redirectTo: 'fooldal', pathMatch:"full" }
];
