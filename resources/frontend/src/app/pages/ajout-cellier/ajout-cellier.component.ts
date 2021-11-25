import { Component, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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

    // Émetteur d'événnement afin d'afficher la liste des celliers sans refresh après l'ajout
    @Output("chargerCelliers") chargerCelliers: EventEmitter<any> = new EventEmitter();

    constructor(
        public formulaireRef: MatDialogRef<AjoutCellierComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private servAuth: AuthService,
        private servBouteilleDeVin: BouteilleDeVinService,
        private snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
    }

    // Affichage d'erreur quand le champ obligatoire n'est pas rempli
    get erreur() {
        return this.ajoutCellier.controls;
    }

    // fermer le modal avec un X
    close(): void {
        this.formulaireRef.close();
    }

    // Fonction qui permet l'ajout d'un nouveau cellier par un utilisateur authentifie
    postCellier(cellier: any) {
        console.log(cellier)

        this.idUtilisateur = this.servAuth.getIdUtilisateurAuthentifie();

        this.nouveauCellier = { ...cellier, "users_id": this.idUtilisateur }


        this.servBouteilleDeVin.ajoutCellier(this.nouveauCellier)
            .subscribe(() => {
                this.snackBar.open("Vous avez ajouté un cellier avec succès", "Fermer", {
                    panelClass: 'notif-success'
                });
                this.formulaireRef.close();

                this.chargerCelliers.emit();
            });

    }

}
