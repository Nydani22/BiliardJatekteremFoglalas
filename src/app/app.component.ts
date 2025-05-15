import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from "./shared/menu/menu.component";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent,MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'BJI';
  isLoggedIn = false;
  isAdmin=false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(async user => {
      this.isLoggedIn = !!user;

      if (user) {
        const role = await this.authService.getRole();
        this.isAdmin = role === 'admin';
        console.log(this.isAdmin);
      } else {
        this.isAdmin = false;
      }
    });
  }

  

  logout(): void {
    this.authService.signOut();
    window.location.href = "/fooldal";
  }

  toggle(sidenav: MatSidenav) {
    sidenav.toggle();
  }
}
