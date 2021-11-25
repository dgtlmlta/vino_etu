import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ActionListeAchatComponent } from '@components/action-liste-achat/action-liste-achat.component';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';


@Component({
  selector: 'app-liste-achats',
  templateUrl: './liste-achats.component.html',
  styleUrls: ['./liste-achats.component.scss']
})
export class ListeAchatsComponent implements OnInit {

  listeAchat: any = [];
  bouteilleSelected!: any[];
  bouteilleId: any;
  idListeAchatBouteille: any;

  constructor(
    private servBouteilleDeVin: BouteilleDeVinService,
    private authService: AuthService,
    public modalAction: MatDialog,
    private actRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
     // Charger la liste d'achat de l'utilisateur.
     this.actRoute.data.subscribe(data => {
      this.listeAchat = data.listeAchat;
  });

  }

  // Fonction permettant ouvrir le modal afin d'action de la liste (supprimer de la liste ou ajouter au cellier)
  actionDansLaListe(bouteilleSelected: any[]){
    // console.log(bouteilleSelected);
    if(bouteilleSelected.length > 0) {

      this.idListeAchatBouteille = bouteilleSelected[0].id;
      this.bouteilleId = bouteilleSelected[0].bouteilles_id;
      
      let refModal = this.modalAction.open(ActionListeAchatComponent, {
        data: bouteilleSelected[0]
      })
      
      const response = refModal.componentInstance.chargerListeAchat.subscribe(() => {
        this.chargerListeAchat()
      });
    }
  }

  // Affichage de la liste d'achat
  chargerListeAchat() {
    this.servBouteilleDeVin.getListeAchatParUtilisateur(this.authService.getIdUtilisateurAuthentifie())
     .subscribe((data: any) => {
         this.listeAchat = data;
     })
  }


  // Vérifier si la liste d'achat contient des bouteilles retourn true ou false
   listeAchatContientBouteille() {
    if(!this.listeAchat) {
      return false;
    }
    return this.listeAchat.length > 0;
  }

}
