import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from '@pages/accueil/accueil.component';
import { CellierComponent } from '@pages/cellier/cellier.component';
import { ListeBouteilleComponent } from '@pages/liste-bouteille/liste-bouteille.component';
import { ListeCelliersComponent } from './pages/liste-celliers/liste-celliers.component'
import { AjoutBouteilleComponent } from '@pages/ajout-bouteille/ajout-bouteille.component';
import { ConnectionComponent } from '@pages/connection/connection.component';
import { CreerCompteComponent } from '@pages/creer-compte/creer-compte.component';
import { FicheBouteilleComponent } from '@pages/fiche-bouteille/fiche-bouteille.component';
import { BouteilleResolverServiceService } from '@services/bouteille-resolver-service.service';
import { ModifierCellierBouteilleComponent } from '@pages/modifier-cellier-bouteille/modifier-cellier-bouteille.component';
import { AuthGuard } from "@services/auth.guard";
import { BouteillesCellierResolver } from '@services/bouteilles-cellier.resolver';
import { ProfilUtilisateurComponent } from '@pages/profil-utilisateur/profil-utilisateur.component';
import { ModifierUtilisateurComponent } from '@pages/modifier-utilisateur/modifier-utilisateur.component';
import { CreationBouteilleComponent } from '@pages/creation-bouteille/creation-bouteille.component';
import { ListeAchatsComponent } from '@pages/liste-achats/liste-achats.component';
import { ListeAchatsResolver } from '@services/liste-achats.resolver';
import { ListeCelliersResolver } from '@services/liste-celliers.resolver';

const routes: Routes = [
    {
        path: "",
        component: AccueilComponent,
        canActivate: [AuthGuard],
    },
    {
        path: "celliers/:id",
        component: CellierComponent,
        canActivate: [AuthGuard],
        resolve: {
            bouteillesCellier: BouteillesCellierResolver
        }
    },
    {
        path: "bouteilles",
        component: ListeBouteilleComponent,
    },
    {
        path: "celliers",
        component: ListeCelliersComponent,
        canActivate: [AuthGuard],
        resolve: {
            listeCelliers: ListeCelliersResolver
        }
    },
    {
        path: "profil",
        component: ProfilUtilisateurComponent,
        canActivate: [AuthGuard],
    },
    {
        path: "profil/modifier",
        component: ModifierUtilisateurComponent,
        canActivate: [AuthGuard],
    },
    {
        path: "bouteilles/ajout",
        component: AjoutBouteilleComponent,
        canActivate: [AuthGuard],
    },
    {
        path: "bouteilles-achetees/:id/modifier",
        component: ModifierCellierBouteilleComponent,
        canActivate: [AuthGuard],
    },
    { path: "connection", component: ConnectionComponent },
    { path: "creerCompte", component: CreerCompteComponent },
    {
        path: "ficheBouteille/:id",
        component: FicheBouteilleComponent,
        resolve: {
            bouteille: BouteilleResolverServiceService
        }
    },
    {
        path: "bouteilles-personnalise/ajout",
        component: CreationBouteilleComponent,
        canActivate: [AuthGuard],
    },
    {
        path: "listeAchats",
        component: ListeAchatsComponent,
        canActivate: [AuthGuard],
        resolve: {
            listeAchat: ListeAchatsResolver
        }
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
