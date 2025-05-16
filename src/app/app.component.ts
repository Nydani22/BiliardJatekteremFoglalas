import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from "./shared/menu/menu.component";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent,MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BJI';
  isLoggedIn: boolean = localStorage.getItem("isLoggedIn") === "true";
  isAdmin: boolean = localStorage.getItem("isAdmin") === "true";
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.signOut();
    window.location.href = "/fooldal";
  }

  toggle(sidenav: MatSidenav) {
    sidenav.toggle();
  }
}
