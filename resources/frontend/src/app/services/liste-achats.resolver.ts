import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BouteilleDeVinService } from './bouteille-de-vin.service';

@Injectable({
  providedIn: 'root'
})
export class ListeAchatsResolver implements Resolve<boolean> {

  constructor(
    private servBouteilleDeVin: BouteilleDeVinService,
    private authService: AuthService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {


    return this.servBouteilleDeVin.getListeAchatParUtilisateur(this.authService.getIdUtilisateurAuthentifie())

  }
}
