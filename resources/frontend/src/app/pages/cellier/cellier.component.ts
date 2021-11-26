import { Component, OnInit } from '@angular/core';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDrawerMode } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Location } from '@angular/common';
import { ElementsActifsService } from '@services/elements-actifs.service';
import { HttpParams } from '@angular/common/http';
import { Categorie } from '@interfaces/categorie';
import { validerEcartPrix } from 'app/validators/validerEcartPrix';

@Component({
    selector: 'app-cellier',
    templateUrl: './cellier.component.html',
    styleUrls: ['./cellier.component.scss']
})
export class CellierComponent implements OnInit {

    // Id du cellier reçu en paramètre du router
    cellierId!: number;

    // Objet qui a les propriétés du cellier
    cellier!: any;

    // Sauvegarder la liste initiale de bouteilles afin de s'éviter une requête http/sql pour un "reset"
    bouteillesCellierInitiales: any;
    bouteillesCellier: any = [];

    // Sujet (observable) permettant de "debouncer" l'envoi de la recherche à la base de données
    rechercheSujet: Subject<HttpParams> = new Subject<HttpParams>();

    // Tableaux pour les options de filtres
    categories: Categorie[] = [];
    origines: string[] = [];

    // Sauvegarder la liste initiale de bouteilles afin de s'éviter une requête http/sql pour un "reset"
    bouteillesInitiales: any;

    // Initialiser le formGroup pour gérer les filtres
    filtres: FormGroup = new FormGroup({
        texteRecherche: new FormControl(""),
        origine       : new FormControl(""),
        prixMin       : new FormControl(""),
        prixMax       : new FormControl(""),
        categories    : new FormArray([]),
    }, {
        validators: validerEcartPrix
    }
    );
    // Permet de savoir si l'utilisateur a effectué une recherche et ainsi présenté le bon template
    estFiltre: boolean = false;

    // Comportement de la sideNav
    mode: MatDrawerMode = "over";

    constructor(
        private servBouteilleDeVin: BouteilleDeVinService,
        private actRoute: ActivatedRoute,
        private location: Location,
        private elementsActifs: ElementsActifsService,
        private router: Router,
        private servAuth: AuthService,
    ) {

    }

    ngOnInit(): void {
        this.cellier = this.location.getState();
        this.cellierId = this.actRoute.snapshot.params.id;

        // Charger les propriétés du cellier
        this.servBouteilleDeVin.getCellier(this.cellierId)
            .subscribe(data => {
                this.cellier = data;
            })

        // Utiliser le resolver pour charger le data des bouteilles du cellier
        this.actRoute.data.subscribe(data => {
            this.bouteillesCellier = this.bouteillesCellierInitiales = data.bouteillesCellier;
        });

        // Charger les catégories pour les filtres
        this.servBouteilleDeVin.getToutesCategories()
            .subscribe((categories: Categorie[]) => {
                this.categories = categories;
                this.initCheckboxes();
            })

        // Charger les origines pour les filtres
        this.servBouteilleDeVin.getOriginesParCellier(this.cellierId)
            .subscribe(data => {
                this.origines = data;
            })
    }


    /**
     *
     * Charger les bouteilles contenues dans le présent cellier
     *
     * @returns {void}
     *
     */
    chargerBouteilles() {
        this.servBouteilleDeVin.getBouteillesParCellier(this.cellierId)
            .subscribe(cellier => {
                this.bouteillesCellier = this.bouteillesCellierInitiales = cellier.data
            });
    }


    /**
     *
     * Vérifier si le cellier contient des bouteilles retourn true ou false
     *
     * @returns {boolean}
     *
     */

    cellierContientBouteille() {
        return this.bouteillesCellier.length > 0;
    }

    /**
     *
     * Permettre le stockage d'un cellier actif avant la navigation afin de faciliter l'ajout d'une bouteille à l'utilisateur
     *
     */
    ajouterBouteilleAuCellier(): void {
        // Stocker l'id du présent cellier comme étant le cellier actif
        this.elementsActifs.setCellierActif(this.cellierId);

        this.router.navigate(["/bouteilles"]);
    }

    // Récupérer et formater la chaine de caractères insérée dans l'espace pour faire la recherche
    batirRechercheTextuelle(): string {
        return this.filtreTexteRecherche?.value.replace("-", " ");
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

    batirFiltres(): HttpParams | null {
        // Bâtir les variables qui agiront en tant que filtres
        const
            categories = this.batirTableauFiltreCategories(),
            rechercheTextuelle = this.batirRechercheTextuelle(),
            origine = this.filtreOrigine?.value,
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
            !origine &&
            !prixMin &&
            !prixMax
        ) {
            this.bouteillesCellier = this.bouteillesCellierInitiales;
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

        if (origine) {
            filtres = filtres.set("origine", origine);
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
    initierRechercheFiltree($event: KeyboardEvent | null = null): void {
        // Ne pas initier la recherche sur tab de changement de champ
        if ($event && $event.key == "Tab") {
            return;
        }

        // Ne pas initier la recherche si le formulaire est invalide
        if (this.filtres.invalid) {
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
            .getBouteillesParCellier(
                this.cellierId,
                filtres)
            .subscribe(bouteilles => {
                this.estFiltre = true;
                this.bouteillesCellier = bouteilles.data;
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

    /**
     *
     * Getters des formControl du formulaire de filtres
     *
     */
    get filtreTexteRecherche() {
        return this.filtres.get("texteRecherche");
    }

    get filtreOrigine() {
        return this.filtres.get("origine");
    }

    get filtrePrixMin() {
        return this.filtres.get("prixMin");
    }

    get filtrePrixMax() {
        return this.filtres.get("prixMax");
    }

    /**
     *
     * Initialiser le tableau de checkboxes pour les filtres par catégories
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
