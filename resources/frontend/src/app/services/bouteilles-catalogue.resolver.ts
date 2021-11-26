import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BouteilleDeVinService } from './bouteille-de-vin.service';

@Injectable({
    providedIn: 'root'
})
export class BouteillesCatalogueResolver implements Resolve<boolean> {
    constructor(
        private servBouteilleDeVin: BouteilleDeVinService,
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {

        return this.servBouteilleDeVin.getListeBouteille()
            .pipe(
                map(data => {
                    return data.data;
                })
            );;
    }
}
