import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';

@Component({
    selector: 'app-creer-compte',
    templateUrl: './creer-compte.component.html',
    styleUrls: ['./creer-compte.component.scss']
})
export class CreerCompteComponent implements OnInit {

    formulaire = new FormGroup({
        first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        dob: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        password: new FormControl('', Validators.required)
    });


    constructor(
        private servBouteilleDeVin: BouteilleDeVinService,
        private router: Router,
        private snackbar: MatSnackBar
    ) { }

    ngOnInit(): void {
    }

    // Affichage d'erreur quand le champ n'est pas rempli
    get erreur() {
        return this.formulaire.controls;
    }

    // Fonction pour la creation d'un nouvel utilisateur
    utilisateur() {

        if (this.formulaire.invalid) {
            this.formulaire.markAllAsTouched();
            return;
        }

        const data = {
            first_name: this.formulaire.value.first_name,
            last_name: this.formulaire.value.last_name,
            dob: this.formulaire.value.dob,
            email: this.formulaire.value.email,
            password: this.formulaire.value.password
        }
        this.servBouteilleDeVin.ajouterUtilisateur(data)
            .subscribe((reponse) => {
                this.router.navigate([`/connection`], { state: { email: this.formulaire.value.email}});
                this.snackbar.open(`Bienvenue! vous avez créer votre compte`, "Fermer", {duration: 3000, panelClass: 'notif'});

            });
    }

}


