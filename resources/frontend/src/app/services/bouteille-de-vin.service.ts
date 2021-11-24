import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatConfirmDialogComponent } from '@components/mat-confirm-dialog/mat-confirm-dialog.component';
import { Categorie } from "@interfaces/categorie";
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class BouteilleDeVinService {

    // private url:string = "http://127.0.0.1:8000/api";
    // private url: string = "http://kalimotxo-vino.akira.dev/api";
    private url: string = new URL(window.location.href).origin + "/api";


    constructor(private servAuth: AuthService, private http: HttpClient, private dialog: MatDialog) {
        console.log(this.url);
    }

    getBouteillesParCellier(cellierId: any, filtres = {}) {
        return this.http.get<any>(
            this.url + '/celliers/' + cellierId + '/bouteilles',
            {
                params: filtres
            }
        );
    }

    getListeBouteille(filtres = {}) {
        return this.http.get<any>(this.url + '/catalogue-bouteilles', {
            params: filtres
        });
    }

    getBouteilleParId(id_bouteille: any) {

        return this.http.get<any>(this.url + '/bouteilles/' + id_bouteille);
    }

    getBouteilleAcheteeParId(id_bouteille: any) {

        return this.http.get<any>(this.url + '/bouteilles-achetees/' + id_bouteille);
    }

    ajoutBouteilleCellier(cellierId: any, bouteilleAchetee: any) {

        return this.http.post<any>(this.url + '/celliers/' + cellierId + '/bouteilles', bouteilleAchetee);

    }


    ajoutBouteilleCatalogue(bouteilleCatalogue: any) {

        return this.http.post<any>(this.url + '/bouteilles', bouteilleCatalogue);

    }

    modifierInventaireCellierBouteille(bouteille_id: any, nouvelInventaire: any) {

        let body = {
            'inventaire': nouvelInventaire,
        }

        return this.http.put<any>(this.url + '/celliers/modifier-inventaire/' + bouteille_id, body);
    }


    modifierBouteilleCellier(bouteilleAchetee_id: any, data: any) {

        return this.http.put<any>(this.url + '/bouteilles-achetees/' + bouteilleAchetee_id, data)

    }

    supprimerBouteilleCellier(bouteilleAchetee_id: any) {

        console.log(bouteilleAchetee_id);

        return this.http.delete<any>(
            this.url + '/supprimer/' + bouteilleAchetee_id)
    }

    supprimerUnCellier(cellier_id: any) {

        return this.http.delete<any>(
            this.url + '/supprimerCellier/' + cellier_id)
    }

    /**
     *
     * Charger les celliers appartenant à l'utilisateur donné
     *
     * @param {number} userId Id de l'utilisateur
     * @returns {Observable} Liste des celliers de l'utilisateur
     */
    getListeCelliersParUtilisateur(userId: number | null): any {
        if (!userId) {
            return false;
        }

        const options = {
            params: {
                userId: userId
            }
        }

        return this.http.get<any>(this.url + "/celliers", options)
    }

    /**
     *
     * Charger les données concernant un cellier donné.
     *
     * @param {number|string} cellierId Id du cellier à charger
     * @returns {Observable}
     */
    getCellier(cellierId: number | string) {
        return this.http.get<any>(
            this.url + "/celliers/" + cellierId
        )
    }


    ajouterUtilisateur(data: any) {
        return this.http.post<any>(this.url + '/creerCompte', data)
    }

    confirmDialog(msg: string) {
        return this.dialog.open(MatConfirmDialogComponent, {
            disableClose: true,
            data: {
                message: msg
            }
        });
    }

    /**
     *
     * @param data
     * @param id
     * @returns
     */
    ajoutCellier(data: any, id: any) {

        return this.http.post<any>(this.url + '/celliers', data);

    }

    getUtilisateurParId(userId: any) {

        return this.http.get<any>(this.url + '/user/' + userId)
    }

    modifierUtilisateur(userId: any, data: any) {

        return this.http.put<any>(this.url + '/user/' + userId, data)
    }

    /**
     * Modifie les données d'un cellier
     *
     * @param {array} data
     *
     * @returns
     */
    modifierCellier(data: any, idCellier: any) {

        let body = {
            'nom': data.nom,
            'description': data.description,
            'image': data.image,
        }

        return this.http.put<any>(this.url + '/celliers/' + idCellier, body);
    }


    ajouterBouteilleListeAchats(data: any) {
        console.log(data.bouteilleId)
        let body = {
            'bouteilles_id': data.bouteilleId,
        }
        return this.http.post<any>(this.url + '/listes-achats/' + this.servAuth.getIdListeAchat() + '/ajout-bouteille', body)
    }


    /**
     *
     * Charger la liste d'achat de l'utilisateur donné
     *
     * @param {number} userId Id de l'utilisateur
     * @returns {Observable} Liste d'achat de l'utilisateur
     */
    getListeAchatParUtilisateur(userId: number|null): any {
        if(!userId) {
            return false;
        }

        const options = {
            params: {
                userId: userId
            }
        }

        return this.http.get<any>(this.url + "/listes-achats", options)
    }
    /**
     *
     * Charger les données concernant les pays d'origine des bouteilles
     *
     * @returns {Observable}
     */
    getListePays() {
        return this.http.get<any>(this.url + "/pays")
            .pipe(
                map(data => data.data)
            );
    }

    /**
     *
     * Supprimer une bouteille de la liste d'achat de l'utilisateur
     *
     * @param {number} listeAchatBouteilleId Id de la liste d'achat
     * @returns {Observable}
     */
    supprimerUneBouteilleListeAchat(listeAchatBouteilleId: any){

        return this.http.delete<any>(
            this.url + '/supprimerBouteille/' + listeAchatBouteilleId)
    }

/**
     *
     * Charger la liste complète des catégories disponibles
     *
     * @returns {Observable}
     */
    getToutesCategories(): any {
        return this.http.get<any>(`${this.url}/categories`)
            .pipe(
                map(data => data.data)
            );
    }
}


