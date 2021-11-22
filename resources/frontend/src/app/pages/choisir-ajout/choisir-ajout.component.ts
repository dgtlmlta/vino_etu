import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-choisir-ajout',
  templateUrl: './choisir-ajout.component.html',
  styleUrls: ['./choisir-ajout.component.scss']
})
export class ChoisirAjoutComponent implements OnInit {

  constructor(
    public formulaireRef: MatDialogRef<ChoisirAjoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }


  // fermer le modal avec un X
    close(): void {
      this.formulaireRef.close();
  }


}
