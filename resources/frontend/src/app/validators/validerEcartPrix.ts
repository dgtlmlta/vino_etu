import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
 } from "@angular/forms";

export function validerEcartPrix(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const
            prixMin = group.get("prixMin")?.value,
            prixMax = group.get("prixMax")?.value;

        // Si le prix min est trop élevé, renvoyer une erreur
        if(prixMin >= prixMax) {
            return {
                prixMinTropEleve:  true
            }
        }

        // Si le prix max est trop bas, renvoyer une erreur
        if(prixMax <= prixMin) {
            return {
                prixMaxTropBas:  true
            }
        }

        return null;
    }
}
