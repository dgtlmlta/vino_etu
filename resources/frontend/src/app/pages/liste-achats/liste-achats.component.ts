import { Component, OnInit } from '@angular/core';
import { MatListOption } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';


@Component({
  selector: 'app-liste-achats',
  templateUrl: './liste-achats.component.html',
  styleUrls: ['./liste-achats.component.scss']
})
export class ListeAchatsComponent implements OnInit {

  listeAchat!: any[];
  bouteilleSelected!: any[];
  idListeAchatBouteille: any;

  constructor(
    private servBouteilleDeVin: BouteilleDeVinService,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {

     // Charger la liste d'achat de l'utilisateur.
     this.servBouteilleDeVin.getListeAchatParUtilisateur(this.authService.getIdUtilisateurAuthentifie())
     .subscribe((data: any) => {
         this.listeAchat = data;
         console.log(data);
     })

  }

  // Affichage de la liste d'achat
  chargerListeAchat() {
    this.servBouteilleDeVin.getListeAchatParUtilisateur(this.authService.getIdUtilisateurAuthentifie())
     .subscribe((data: any) => {
         this.listeAchat = data;
         console.log(data);
     })
}

  supprimerDeLaListe(bouteilleSelected: any[]){
    console.log(bouteilleSelected);
    if(bouteilleSelected.length == 0) {
      return
    }
    this.idListeAchatBouteille = bouteilleSelected[0].id;
    console.log(this.idListeAchatBouteille)
    this.servBouteilleDeVin.confirmDialog(`Voulez vous ajouter cette bouteille au cellier ?`)
            .afterClosed().subscribe(res => {
                if (res) {
                    this.servBouteilleDeVin.supprimerUneBouteilleListeAchat(this.idListeAchatBouteille).subscribe(() => {
                        this.chargerListeAchat();
                        this.snackbar.open('Vous avez supprimer la bouteille de la liste', 'Fermer');
                    });
                }
            })
  }
}
