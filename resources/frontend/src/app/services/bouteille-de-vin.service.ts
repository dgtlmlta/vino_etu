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
    private url: string = "http://192.168.50.238/api"
    // private url: string = new URL(window.location.href).origin + "/api";


    constructor(private servAuth: AuthService, private http: HttpClient, private dialog: MatDialog) {
    }

    /**
     * Récuperer tous les bouteilles d'un cellier
     * 
     * @param {array} filtres Contient des filtres
     * @param {int} cellierId Contient l'id du cellier
     * @returns {Observable} Liste des bouteilles d'un cellier
     */

    getBouteillesParCellier(cellierId: any, filtres = {}) {
        return this.http.get<any>(
            this.url + '/celliers/' + cellierId + '/bouteilles',
            {
                params: filtres
            }
        );
    }

    /**
     * Récuperer tous les bouteilles du catalogue
     * 
     * @param {array} filtres Contient des filtres
     * @returns {Observable} Liste des bouteilles du catalogue
     */

    getListeBouteille(filtres = {}) {
        return this.http.get<any>(this.url + '/catalogue-bouteilles', {
            params: filtres
        });
    }

    /**
     * Récuperer une bouteille du catalogue par id
     * 
     * @param {int} id_bouteille Contient l'id de la bouteille 
     * @returns {Observable} Bouteille du catalogue
     */

    getBouteilleParId(id_bouteille: any) {

        return this.http.get<any>(this.url + '/bouteilles/' + id_bouteille);
    }

    
    /**
     * Récuperer une bouteille achetee par id
     * 
     * @param {int} id_bouteille Contient l'id de la bouteille
     * @returns {Observable} Bouteille achetee
     */

    getBouteilleAcheteeParId(id_bouteille: any) {

        return this.http.get<any>(this.url + '/bouteilles-achetees/' + id_bouteille);
    }

    /**
     * Ajouter une bouteille au cellier
     * 
     * @param {array} bouteilleAchetee Contient l'information d'une bouteile
     * @param {int} cellier_id Contient l'id du cellier
     * @returns {Observable} Bouteille
     */

    ajoutBouteilleCellier(cellierId: any, bouteilleAchetee: any) {

        return this.http.post<any>(this.url + '/celliers/' + cellierId + '/bouteilles', bouteilleAchetee);

    }

    /**
     * Ajouter une bouteille au catalogue
     * 
     * @param {array} bouteilleCatalogue Contient l'information d'une bouteile
     * @returns {Observable} Bouteille
     */

    ajoutBouteilleCatalogue(bouteilleCatalogue: any) {

        return this.http.post<any>(this.url + '/bouteilles', bouteilleCatalogue);

    }


    /**
     * Modifie les données de l'inventaire d'une bouteille dans le cellier
     *
     * @param {int} nouvelInventaire Contient la quantité de l'inventaire
     * @param {int} bouteille_id Contient l'id de la bouteille
     *
     * @returns {Observable} Inventaire modifié
     */
    

    modifierInventaireCellierBouteille(bouteille_id: any, nouvelInventaire: any) {

        let body = {
            'inventaire': nouvelInventaire,
        }

        return this.http.put<any>(this.url + '/celliers/modifier-inventaire/' + bouteille_id, body);
    }



    /**
     * Modifie les données d'une bouteille dans le cellier
     *
     * @param {array} data Contient l'information de la bouteille
     * @param {int} bouteilleAchetee_id Contient l'id de la bouteille
     *
     * @returns {Observable} Bouteille modifié
     */

    modifierBouteilleCellier(bouteilleAchetee_id: any, data: any) {

        return this.http.put<any>(this.url + '/bouteilles-achetees/' + bouteilleAchetee_id, data)

    }

    /**
     * Supprimer une bouteille d'un cellier voulu
     * 
     * @param {int} bouteilleAchetee_id contient l'id de la bouteille
     * @returns {Observable} 
     */

    supprimerBouteilleCellier(bouteilleAchetee_id: any) {

        return this.http.delete<any>(
            this.url + '/supprimer/' + bouteilleAchetee_id)
    }

    /**
     * Supprimer un cellier dans la bd
     * 
     * @param {int} cellier_id contient l'id d'un cellier
     * @returns {Observable} 
     */

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
     * @returns {Observable} cellier
     */
    getCellier(cellierId: number | string) {
        return this.http.get<any>(
            this.url + "/celliers/" + cellierId
        )
    }

    /**
     * Ajouter un utilisateur à la bd
     * 
     * @param {array} data Contient l'information d'un utilisateur
     * @returns {Observable} utilisateur
     */

    ajouterUtilisateur(data: any) {
        return this.http.post<any>(this.url + '/creerCompte', data)
    }

    /**
     * Fonction pour l'affichage du modal de confirmation 
     * 
     * @param {string} msg Contient le message voulu 
     * @returns {Observable} modal
     */

    confirmDialog(msg: string) {
        return this.dialog.open(MatConfirmDialogComponent, {
            disableClose: true,
            data: {
                message: msg
            }
        });
    }

    /**
     * Ajouter un cellier dans la bd
     * 
     * @param {array} data Contient l'information d'un cellier
     * @returns {Observable} cellier
     */
    ajoutCellier(data: any) {

        return this.http.post<any>(this.url + '/celliers', data);

    }

    /**
     * Récupere un utilisateur selon un id
     *
     * @param {int} userId Contient l'id de l'utilisateur
     *
     * @returns {Observable} Utilisateur
     */

    getUtilisateurParId(userId: any) {

        return this.http.get<any>(this.url + '/user/' + userId)
    }

    /**
     * Modifie les données d'un utilisateur
     *
     * @param {array} data Contient l'information d"un utilisateur
     * @param {int} userId Contient l'id de l'utilisateur
     *
     * @returns {Observable} utilisateur modifié
     */

    modifierUtilisateur(userId: any, data: any) {

        return this.http.put<any>(this.url + '/user/' + userId, data)
    }

    /**
     * Modifie les données d'un cellier
     *
     * @param {array} data Contient l'information d"un cellier
     *
     * @returns {Observable} Cellier modifié
     */
    modifierCellier(data: any, idCellier: any) {

        let body = {
            'nom': data.nom,
            'description': data.description,
            'image': data.image,
        }

        return this.http.put<any>(this.url + '/celliers/' + idCellier, body);
    }

    /**
     *
     *  Ajouter une bouteille à la liste d'achat
     *
     * @param {array} data Contient l'id de la bouteille
     * @returns {Observable} Liste d'achat
     */

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


