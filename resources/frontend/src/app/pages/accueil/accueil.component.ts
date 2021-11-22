import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChoisirAjoutComponent } from '@pages/choisir-ajout/choisir-ajout.component';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  constructor(
    public formChoix: MatDialog,
  ) {}

  ngOnInit(): void {

  }

   // Appel du formulaire pour le choix du type d'ajout, du catalogue ou personnalisée

   formulaireChoix(): void {
    let refModal = this.formChoix.open(ChoisirAjoutComponent);
  }

}
