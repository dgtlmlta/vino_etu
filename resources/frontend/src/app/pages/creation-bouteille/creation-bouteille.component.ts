import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import { Location } from '@angular/common'

@Component({
  selector: 'app-creation-bouteille',
  templateUrl: './creation-bouteille.component.html',
  styleUrls: ['./creation-bouteille.component.scss']
})
export class CreationBouteilleComponent implements OnInit {

  ajoutBouteille = new FormGroup({
    millesime: new FormControl(''),
    inventaire: new FormControl('', Validators.required),
    date_acquisition: new FormControl(''),
    prix_paye: new FormControl(''),
    conservation: new FormControl(''),
    notes_personnelles: new FormControl(''),
    cellierId: new FormControl('', Validators.required),
});

  constructor(private location: Location,) { }

  ngOnInit(): void {
  }

  // Affichage des erreurs quand le champs n'est pas rempli
    get erreur() {
      return this.ajoutBouteille.controls;
  }

  // Revenir à la page précédente
    back(): void {
      this.location.back()
  }


}
