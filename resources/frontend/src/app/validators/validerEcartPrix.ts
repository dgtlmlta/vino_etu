import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
} from "@angular/forms";

export const validerEcartPrix: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const
        prixMin = +(group.get("prixMin")?.value),
        prixMax = +(group.get("prixMax")?.value);

    // Si un des deux champs est vide, ne pas faire de validation
    if(!prixMin || !prixMax) {
        return null;
    }

    // Si le prix min est trop élevé, renvoyer une erreur
    if (prixMin >= prixMax) {
        console.log(`Prix min : ${prixMin} et prix max : ${prixMax}`);
        return {
            prixMinTropEleve: true
        }
    }

    // Si le prix max est trop bas, renvoyer une erreur
    if (prixMax <= prixMin) {
        return {
            prixMaxTropBas: true
        }
    }

    return null;
}
