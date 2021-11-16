import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ElementsActifsService {
    private cellierActifId: number|null = null;

    constructor() { }

    setCellierActif(id: number): void {
        console.log(id);

        if(!id) {
            return;
        }

        this.cellierActifId =  id;
    }

    getCellierActif(): number|null {

        console.log(this.cellierActifId);
        return this.cellierActifId;
    }
}
