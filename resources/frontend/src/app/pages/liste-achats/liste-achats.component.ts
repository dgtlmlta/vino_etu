import { Component, OnInit } from '@angular/core';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';

@Component({
  selector: 'app-liste-achats',
  templateUrl: './liste-achats.component.html',
  styleUrls: ['./liste-achats.component.scss']
})
export class ListeAchatsComponent implements OnInit {

  bouteille: any;

  constructor(
    private servBouteilleDeVin: BouteilleDeVinService,
  ) { }

  ngOnInit(): void {

  }


}
