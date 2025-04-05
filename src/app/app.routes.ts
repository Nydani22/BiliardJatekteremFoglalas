import { Routes } from '@angular/router';
import { FooldalComponent } from './pages/fooldal/fooldal.component';
import { FoglalasComponent } from './pages/foglalas/foglalas.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfilComponent } from './pages/profil/profil.component';

export const routes: Routes = [
    {path: 'fooldal', component: FooldalComponent},
    {path: 'foglalas', component: FoglalasComponent},
    {path: 'profil', component: ProfilComponent},
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: 'fooldal', pathMatch:"full" },
    {path: '**', redirectTo: 'fooldal', pathMatch:"full" }
];
