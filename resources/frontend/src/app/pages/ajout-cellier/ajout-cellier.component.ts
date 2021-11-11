import { Component, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ajout-cellier',
  templateUrl: './ajout-cellier.component.html',
  styleUrls: ['./ajout-cellier.component.scss']
})
export class AjoutCellierComponent implements OnInit {

  nouveauCellier: any;

  idUtilisateur: any;

  ajoutCellier = new FormGroup({
    nom: new FormControl('', Validators.required),
    description: new FormControl(''),
});

@Output("chargerCelliers") chargerCelliers: EventEmitter<any> = new EventEmitter();

  constructor( public formulaireRef: MatDialogRef<AjoutCellierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private servAuth: AuthService,
    private servBouteilleDeVin: BouteilleDeVinService) { }

  ngOnInit(): void {
  }

  get erreur() {
    return this.ajoutCellier.controls;
  }

  

  postCellier(cellier: any) {
    console.log(cellier)

    this.idUtilisateur = this.servAuth.getIdUtilisateurAuthentifie();

    this.nouveauCellier = { ...cellier, "users_id":this.idUtilisateur }


    this.servBouteilleDeVin.ajoutCellier(this.nouveauCellier, this.idUtilisateur)
        .subscribe(() => {

          this.formulaireRef.close();

         this.chargerCelliers.emit();

        });      

  }

}
