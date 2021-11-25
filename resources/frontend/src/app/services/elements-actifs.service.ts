import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ElementsActifsService {
    private cellierActifId: number | null = null;

    constructor() { }

    setCellierActif(id: number | null): void {
        this.cellierActifId = id;
    }

    getCellierActif(): number | null {
        return this.cellierActifId;
    }
}
