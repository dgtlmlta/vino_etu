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

    // Tableau contenant les catégories et leur id
    categories: Categorie[] = [];

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
                this.categories = categories;
                this.initCheckboxes();
            })
    }

    openSnackBar(message: any, action: any) {
        this.snackBar.open(message, action, {
            duration: 3000,
            panelClass: 'notif-success'
        });
    }

    // Récupérer les 3 caractères inséré dans l'espace pour faire la recherche
    batirRechercheTextuelle(): null | string {
        if (this.texteRecherche?.value.length < 3 && this.bouteille != this.bouteillesInitiales) {
            this.bouteille = this.bouteillesInitiales;
            return null;
        }

        return this.texteRecherche?.value.replace("-", " ");
    }

    // Fonction de recherche d'un bouteille dans le catalogue
    batirRechercheFiltree(): void {
        const categories = this.batirTableauFiltreCategories();
        const rechercheTextuelle = this.batirRechercheTextuelle();


        // this.servBouteilleDeVin
        //     .getListeBouteille({
        //         texteRecherche:
        //     })
        //     .subscribe(bouteille => {
        //         this.bouteille = bouteille.data;
        //     });
        if (this.rechercheSujet.observers.length === 0) {
            this.rechercheSujet
                .pipe(
                    debounceTime(700),
                    distinctUntilChanged()
                )
                .subscribe(recherche => {
                    this.effectuerRechercheFiltree();
                });
        }

        this.rechercheSujet.next(this.texteRecherche?.value);
    }

    effectuerRechercheFiltree(filtres: ) {
        let filtres = {};


        this.servBouteilleDeVin
            .getListeBouteille(filtres)
            .subscribe(bouteille => {
                this.bouteille = bouteille.data;
            });
    }

    // Fonction pour ajouter la bouteille à la liste d'achat
    ajouterListeAchats(bouteilleId: any) {
        let userId = this.servAuth.getIdUtilisateurAuthentifie();

        this.itemListeAchat = { userId, bouteilleId }
        console.log(this.itemListeAchat)

        this.servBouteilleDeVin.ajouterBouteilleListeAchats(this.itemListeAchat).subscribe(() => {
            this.openSnackBar(`Vous avez ajouté une bouteille à votre liste d'achat`, 'Fermer')

            //this.router.navigate(['/bouteilles']);
        });
    }

    batirTableauFiltreCategories(): number[] {
        // Récupérer un tableau des ids sélectionnés en utilisant la valeur (true / false) du tableau de checkboxes parallèlement au tableau des catégories
        const tableauIds = this.categories.reduce((tableauCategoriesId, categorie, index) => {
            if (this.listeCategoriesEnFormArray.controls[index].value) {
                tableauCategoriesId.push(categorie.id);
            }
            return tableauCategoriesId;
        }, [] as number[])

        return tableauIds;
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
    initCheckboxes(): void {
        this.categories.forEach(categorie => {
            // Pour chaque instance de catégorie, créer un formControl dans le formArray
            this.listeCategoriesEnFormArray.push(
                new FormControl(false)
            );
        })
    }
}
