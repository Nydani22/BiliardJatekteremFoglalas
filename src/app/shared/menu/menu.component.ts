import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, AfterViewInit {

  @Input() sidepanel!: MatSidenav;
  @Input() isLoggedIn!: boolean;
  @Input() isAdmin!: boolean;
  @Output() logoutEvent=new EventEmitter<void>();



  constructor(private authService: AuthService) {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {}


  closeMenu() {
    if (this.sidepanel) {
        this.sidepanel.close();
    }
  }

  logout() {
    this.authService.signOut();
    this.logoutEvent.emit();
    this.closeMenu();
  }
}
