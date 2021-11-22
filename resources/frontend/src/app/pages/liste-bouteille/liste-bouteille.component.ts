import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categorie } from '@interfaces/categorie';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
    selector: 'app-liste-bouteille',
    templateUrl: './liste-bouteille.component.html',
    styleUrls: ['./liste-bouteille.component.scss']
})
export class ListeBouteilleComponent implements OnInit {
    bouteille: any;

    itemListeAchat: any;


    // Sujet (observable) permettant de "debouncer" l'envoi de la recherche à la base de données
    rechercheSujet: Subject<string> = new Subject<string>();

    // Sauvegarder la liste initiale de bouteilles afin de s'éviter une requête http/sql pour un "reset"
    bouteillesInitiales: any;

    // Initialiser le formGroup pour gérer les filtres
    filtres: FormGroup = new FormGroup({
        texteRecherche: new FormControl(""),
        categories: new FormArray([]),
    });


    constructor(
        private servBouteilleDeVin: BouteilleDeVinService,
        private servAuth: AuthService,
        private snackBar: MatSnackBar,
        //private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.servBouteilleDeVin.getListeBouteille()
            .subscribe(
                bouteille => this.bouteillesInitiales = this.bouteille = bouteille.data
            );

        this.servBouteilleDeVin.getToutesCategories()
                .subscribe((categories: any) => {
                    this.initCheckboxes(categories);
                })
    }

    openSnackBar(message: any, action: any) {
        this.snackBar.open(message, action, {
            duration: 3000,
            panelClass: 'notif-success'
        });
    }

    // Récupérer les 3 caractères inséré dans l'espace pour faire la recherche
    recherche($event: any): void {

        if (this.texteRecherche?.value.length < 3 && this.bouteille != this.bouteillesInitiales) {
            this.bouteille = this.bouteillesInitiales;
            return;
        }

        if (this.rechercheSujet.observers.length === 0) {
            this.rechercheSujet
                .pipe(debounceTime(700), distinctUntilChanged())
                .subscribe(recherche => {
                    if (this.texteRecherche?.value.length >= 3) {
                        this.effectuerRechercheFiltree();
                    }
                });
        }

        this.rechercheSujet.next(this.texteRecherche?.value);
    }

    // Fonction de recherche d'un bouteille dans le cellier
    effectuerRechercheFiltree(): void {
        this.servBouteilleDeVin
            .getListeBouteille({
                texteRecherche: this.texteRecherche?.value.replace("-", " ")
            })
            .subscribe(bouteille => {
                this.bouteille = bouteille.data;
            });
    }

    // Fonction pour ajouter la bouteille à la liste d'achat
    ajouterListeAchats(bouteilleId:any) {
        let userId = this.servAuth.getIdUtilisateurAuthentifie();

        this.itemListeAchat = { userId, bouteilleId }
        console.log(this.itemListeAchat)

        this.servBouteilleDeVin.ajouterBouteilleListeAchats(this.itemListeAchat).subscribe(() => {
            this.openSnackBar(`Vous avez ajouté une bouteille à votre liste d'achat`, 'Fermer')

            //this.router.navigate(['/bouteilles']);
        });
    }

    /**
     *
     * Getter et typage du formArray pour les catégories     *
     *
     */
    get listeCategoriesEnFormArray() {
        return this.filtres.get("categories") as FormArray;
    }

    get texteRecherche() {
        return this.filtres.get("texteRecherche");
    }

    /**
     *
     * @param {Categorie[]} categories Tableau comportant toutes les options de catégories
     */
    initCheckboxes(categories: Categorie[]): void {
        categories.forEach(categorie => {
            // Pour chaque instance de catégorie, créer un formControl dans le formArray en lui ajoutant une propriété permettant de connaitre son statut (checked / unchecked)
            this.listeCategoriesEnFormArray.push(
                new FormControl({
                    ...categorie,
                    checked: false
                })
            );
        })
    }
}
