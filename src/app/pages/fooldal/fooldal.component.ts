import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { Termek } from '../../shared/data';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-fooldal',
  imports: [MatGridListModule, MatButtonModule, MatIconModule],
  templateUrl: './fooldal.component.html',
  styleUrl: './fooldal.component.scss'
})
export class FooldalComponent {
  Termek=Termek;
  constructor() {}
  foglal(id:number) {
    localStorage.setItem("teremId", id.toString());
    window.location.href="/foglalas";
    //console.log(localStorage.getItem("teremId"));
  }
}
