import { DatePipe, formatCurrency } from '@angular/common';
import {Component, Inject, OnInit,} from '@angular/core';
import {FormControl,FormGroup,Validators} from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { ElementsActifsService } from '@services/elements-actifs.service';
import { StringHelpersService } from '@services/helpers/string-helpers.service';

@Component({
    selector: 'app-ajout-bouteille',
    templateUrl: './ajout-bouteille.component.html',
    styleUrls: ['./ajout-bouteille.component.scss']
})
export class AjoutBouteilleComponent implements OnInit {


    bouteilleAchetee: any;
    bouteilleData: any;
    listeCelliers!: any[];

    // Form group

    ajoutBouteille = new FormGroup({
        millesime: new FormControl(''),
        inventaire: new FormControl('1', [Validators.required, Validators.min(1)]),
        date_acquisition: new FormControl(''),
        prix_paye: new FormControl(''),
        conservation: new FormControl(''),
        notes_personnelles: new FormControl(''),
        cellierId: new FormControl('', Validators.required),
    });

    constructor(
        private servBouteilleDeVin: BouteilleDeVinService,
        private authService: AuthService,
        private actRoute: ActivatedRoute,
        public formulaireRef: MatDialogRef<AjoutBouteilleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private snackBar: MatSnackBar,
        private router: Router,
        private datePipe: DatePipe,
        private stringHelp: StringHelpersService,
        private elementsActifs: ElementsActifsService,

    ) { }

    ngOnInit(): void {
        // Charger les données passées par le parent dans le l'objet
        this.bouteilleData = this.data;

        // Récupérer la date du jour valeur par défaut du formulaire
        this.ajoutBouteille.get("date_acquisition")?.setValue(
            this.datePipe.transform(new Date(), "yyyy-MM-dd")
        );

        // Récupérer le prix de la bouteille comme valeur par défaut du formulaire
        this.ajoutBouteille.get("prix_paye")?.setValue(this.stringHelp.formaterNombreEnDollarsCanadiens(this.bouteilleData.prix));

        // Charger la liste des celliers de l'utilisateur.
        this.servBouteilleDeVin.getListeCelliersParUtilisateur(this.authService.getIdUtilisateurAuthentifie())
            .subscribe((data: any) => {
                this.listeCelliers = data;

                // Si un cellier actif existe dans le service, le sélectionner comme option initiale du select
                const cellierActif = this.elementsActifs.getCellierActif();

                if (cellierActif) {
                    this.ajoutBouteille.controls.cellierId.setValue(cellierActif);
                }
            })
    }

    // Affichage des erreurs quand le champs n'est pas rempli
    get erreur() {
        return this.ajoutBouteille.controls;
    }

    // fonction pour fermer le modal avec un X
    close(): void {
        this.formulaireRef.close();
    }

    openSnackBar(message: any, action: any) {

        this.snackBar.open(message, action, {
            panelClass: 'notif-success'
        })
        .onAction()
        .subscribe( 
            () => this.router.navigate(['/celliers/'+ this.ajoutBouteille.get('cellierId')?.value])
        );

        
    }

    // Function pour ajouter une bouteille au cellier
    postBouteilleCellier(bouteille: any) {

        if (this.ajoutBouteille.invalid) {
            this.ajoutBouteille.markAllAsTouched();
            return;
        }

        this.bouteilleAchetee = { ...this.data, ...bouteille }

        this.bouteilleAchetee.origine = this.data.pays;
        this.bouteilleAchetee.users_id = 1;

        this.servBouteilleDeVin.ajoutBouteilleCellier(bouteille.cellierId, this.bouteilleAchetee)
            .subscribe(() => {
                this.openSnackBar('Vous avez ajouté une bouteille à votre cellier', 'Afficher')

                this.formulaireRef.close();

                this.router.navigate(['/bouteilles']);
            });
    }

    formatterPrix() {
        const nombre = this.stringHelp.recupererNombreDeDevise(this.ajoutBouteille.get("prix_paye")?.value);
        // Formatter le prix en device canadienne au fur et à mesure que l'utilisateur interagit
        this.ajoutBouteille.get("prix_paye")?.setValue(this.stringHelp.formaterNombreEnDollarsCanadiens(nombre));
    }

    /**
     *
     * Comparer les valeurs des options d'id de celliers afin de sélectionner celle qui correspond à la valeur donnée au formControl.
     *
     * @param {number} id1
     * @param {number|string} id2
     * @returns {boolean}
     */
     comparerCellierId(id1: number, id2: string|number): boolean {
        return id1 == id2;
    }
}
