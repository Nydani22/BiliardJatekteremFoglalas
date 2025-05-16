import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Terem } from '../../shared/model/termek';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeremService } from '../../shared/services/terem.service';


@Component({
  selector: 'app-fooldal',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './fooldal.component.html',
  styleUrl: './fooldal.component.scss'
})
export class FooldalComponent implements OnInit {
  termek: Terem[] = [];
  loading = true;

  constructor(private teremService: TeremService) {}

  ngOnInit(): void {
    this.teremService.getAllTermek().subscribe({
      next: (data) => {
        this.termek = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Hiba a termek lekérdezésekor:', err);
      }
    });
  }
  
  foglal(id: string) {
    localStorage.setItem("teremId", id);
    window.location.href = "/foglalas";
  }
}
