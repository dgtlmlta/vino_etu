import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Categorie } from '@interfaces/categorie';
import { Pays } from '@interfaces/pays';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { FiltresRecherche } from 'app/filtres-recherche';
import { validerEcartPrix } from 'app/validators/validerEcartPrix';
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
    rechercheSujet: Subject<HttpParams> = new Subject<HttpParams>();

    // Tableaux pour les options de filtres
    categories: Categorie[] = [];
    pays: Pays[] = [];

    // Sauvegarder la liste initiale de bouteilles afin de s'éviter une requête http/sql pour un "reset"
    bouteillesInitiales: any;

    // Initialiser le formGroup pour gérer les filtres
    filtres: FormGroup = new FormGroup({
        texteRecherche: new FormControl(""),
        paysId: new FormControl(""),
        prixMin: new FormControl(""),
        prixMax: new FormControl(""),
        categories: new FormArray([]),
    }, {
        validators: validerEcartPrix
        }
    );


    constructor(
        private servBouteilleDeVin: BouteilleDeVinService,
        private servAuth: AuthService,
        private snackBar: MatSnackBar,
        private router: Router,
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

        this.servBouteilleDeVin.getListePays()
            .subscribe((pays: Pays[]) => {
                this.pays = pays;
            })
    }

    openSnackBar(message: any, action: any) {
        this.snackBar.open(message, action, {
            duration: 3000,
            panelClass: 'notif-success'
        })
        .onAction()
        .subscribe( 
            () => this.router.navigate(['/listeAchats'])
        );;
    }

    // Récupérer les 3 caractères inséré dans l'espace pour faire la recherche
    batirRechercheTextuelle(): string {
        return this.filtreTexteRecherche?.value.replace("-", " ");
    }

    batirFiltres(): HttpParams | null {
        // Bâtir les variables qui agiront en tant que filtres
        const
            categories = this.batirTableauFiltreCategories(),
            rechercheTextuelle = this.batirRechercheTextuelle(),
            paysId = this.filtrePaysId?.value,
            prixMin = (!isNaN(this.filtres.get("prixMin")?.value)) ?
                this.filtres.get("prixMin")?.value :
                null,
            prixMax = (!isNaN(this.filtres.get("prixMax")?.value)) ?
                this.filtres.get("prixMax")?.value :
                null;

        // Si la recherche est "vide", réinitialiser aux catalogue de départ
        if (
            categories.length === 0 &&
            !rechercheTextuelle &&
            !paysId &&
            !prixMin &&
            !prixMax
        ) {
            this.bouteille = this.bouteillesInitiales;
            return null;
        }

        let filtres = new HttpParams();

        // Ajouter les filtres existants à l'objet de recherche
        if (rechercheTextuelle) {
            filtres = filtres.set("texteRecherche", rechercheTextuelle);
        }

        if (categories.length > 0) {
            const compteCategories = categories.length;
            for (let i = 0; i < compteCategories; i++) {
                // On doit d'abord "setter" le paramètre...
                if (i === 0) {

                    filtres = filtres.set("categories[]", categories[i]);
                    continue;
                }

                //  ...et ensuite on annexe les valeurs supplémentaires à ce même paramètre
                filtres = filtres.append("categories[]", categories[i]);
            }
        }

        if (paysId) {
            filtres = filtres.set("paysId", paysId);
        }

        if (prixMin) {
            filtres = filtres.set("prixMin", prixMin);
        }

        if (prixMax) {
            filtres = filtres.set("prixMax", prixMax);
        }

        return filtres;
    }

    /**
     *
     * Amorcer la recherche en batissant les filtres nécessaires et initiant un debounce au besoin
     *
     */
    initierRechercheFiltree($event: KeyboardEvent|null = null): void {
        // Ne pas initier la recherche sur tab de changement de champ
        if($event && $event.key == "Tab") {
            return;
        }

        // Ne pas initier la recherche si le formulaire est invalide
        if(this.filtres.invalid) {
            console.log(this.filtres.errors);
            return;
        }

        const filtres = this.batirFiltres() ?? undefined;

        if (this.rechercheSujet.observers.length === 0) {
            this.rechercheSujet
                .pipe(
                    debounceTime(400),
                    distinctUntilChanged((previous, next) => {
                        return previous === next;
                    })
                )
                .subscribe(filtres => {
                    this.effectuerRechercheFiltree(filtres);
                });
        }

        this.rechercheSujet.next(filtres);
    }

    effectuerRechercheFiltree(filtres: HttpParams | null): void {
        if (!filtres) {
            return;
        }

        this.servBouteilleDeVin
            .getListeBouteille(filtres)
            .subscribe(bouteilles => {
                this.bouteille = bouteilles.data;
            });
    }

    // Fonction pour ajouter la bouteille à la liste d'achat
    ajouterListeAchats(bouteilleId: any) {
        let userId = this.servAuth.getIdUtilisateurAuthentifie();

        this.itemListeAchat = { userId, bouteilleId }

        this.servBouteilleDeVin.ajouterBouteilleListeAchats(this.itemListeAchat).subscribe(() => {
            this.openSnackBar(`Vous avez ajouté une bouteille à votre liste d'achat`, 'Afficher')

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

    /**
     *
     * Getters des formControl du formulaire de filtres
     *
     */
    get filtreTexteRecherche() {
        return this.filtres.get("texteRecherche");
    }

    get filtrePaysId() {
        return this.filtres.get("paysId");
    }

    get filtrePrixMin() {
        return this.filtres.get("prixMin");
    }

    get filtrePrixMax() {
        return this.filtres.get("prixMax");
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
