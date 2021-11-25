import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-mat-confirm-dialog',
    templateUrl: './mat-confirm-dialog.component.html',
    styleUrls: ['./mat-confirm-dialog.component.scss']
})
export class MatConfirmDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<MatConfirmDialogComponent>,
    ) { }

    ngOnInit(): void {
    }

    // Fonction pour fermer le modal de confirmation
    close() {
        this.dialogRef.close(false);
    }

}
