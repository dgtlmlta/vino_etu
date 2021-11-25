import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'angular';

    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon(
            `cellier`,
            this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cellar-barrels-svgrepo-com.svg")
          );
        this.matIconRegistry.addSvgIcon(
            `catalogue`,
            this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/noun_wine bottle_2391621.svg")
        );
     }

     // pour afficher le haut de la page suite a un changement de route
     onActivate($event: any) {
        window.scroll(0,0);
    }
}

