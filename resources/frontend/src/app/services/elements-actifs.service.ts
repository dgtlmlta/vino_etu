import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ElementsActifsService {
    private cellierActifId!: number;

    constructor() { }

    setCellierActif(id: number): void {
        if(!id) {
            return;
        }

        this.cellierActifId =  id;
    }
}
