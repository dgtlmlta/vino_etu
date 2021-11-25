import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AjoutBouteilleComponent } from '@pages/ajout-bouteille/ajout-bouteille.component';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action-liste-achat',
  templateUrl: './action-liste-achat.component.html',
  styleUrls: ['./action-liste-achat.component.scss']
})
export class ActionListeAchatComponent implements OnInit {


  // Émetteur d'événnement afin d'afficher la liste sans refresh après l'action
  @Output("chargerListeAchat") chargerListeAchat: EventEmitter<any> = new EventEmitter();

  constructor(
    private servBouteilleDeVin: BouteilleDeVinService,
    public formAjout: MatDialog,
    private snackBar: MatSnackBar,
    public modalAction: MatDialogRef<ActionListeAchatComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

  ngOnInit(): void {
  }

  // fermer le modal avec un X
  close(): void {
    this.modalAction.close();
}

  // Fonction qui permet l'affichage de formulaire d'jout d'une bouteille au cellier
  ajouterCellier(bouteilles_id:any, idListe:any){


    this.servBouteilleDeVin.getBouteilleParId(bouteilles_id).subscribe(data => {

      // Appel du formulaire d'ajout d'un bouteille
          this.formAjout.open(AjoutBouteilleComponent, {
             data: data.data
          })
          this.servBouteilleDeVin.supprimerUneBouteilleListeAchat(idListe).subscribe(() => {
            this.modalAction.close();

          });
    });
  }


  // Fonction qui permet supprimer la bouteille de la liste d'achat
  supprimerDeLaListe(idListe:any){

    this.servBouteilleDeVin.supprimerUneBouteilleListeAchat(idListe).subscribe(() => {

      this.snackBar.open('Vous avez supprimer la bouteille de la liste', 'Fermer');
      this.modalAction.close();
      this.chargerListeAchat.emit();
    });
  }

}
