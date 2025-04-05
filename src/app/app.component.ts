import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from "./shared/menu/menu.component";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent,MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'BJI';
  isLoggedIn=false;

  constructor() {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn=localStorage.getItem('isLoggedIn')==="true";
  }

  logout(): void {
    this.isLoggedIn=false;
    localStorage.setItem("isLoggedIn","false");
    window.location.href="/fooldal";
    
  }
  


  toggle(sidenav: MatSidenav){
    sidenav.toggle();
  }
}
