import { Component, OnInit } from '@angular/core';
import { MatListOption } from '@angular/material/list';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';


@Component({
  selector: 'app-liste-achats',
  templateUrl: './liste-achats.component.html',
  styleUrls: ['./liste-achats.component.scss']
})
export class ListeAchatsComponent implements OnInit {

  listeAchat!: any[];

  constructor(
    private servBouteilleDeVin: BouteilleDeVinService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

     // Charger la liste d'achat de l'utilisateur.
     this.servBouteilleDeVin.getListeAchatParUtilisateur(this.authService.getIdUtilisateurAuthentifie())
     .subscribe((data: any) => {
         this.listeAchat = data;
         console.log(data);
     })

  }

  bouteilleSelected(options: MatListOption[]){

    console.log(options.map(o => o.value))

  }
}
