import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CacheRouteReuseStrategy implements RouteReuseStrategy {
    storedRouteHandles = new Map<string, DetachedRouteHandle>();

    allowRetriveCache: {
        [key: string]: boolean
    } = {
            'bouteilles': true
        };

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        if (this.getPath(future) === "" && this.getPath(curr) === "") {
            return true;
        }

        this.allowRetriveCache['bouteilles'] = false;

        if (this.getPath(future) == 'bouteilles' && this.getPath(curr) == 'ficheBouteille/:id') {
            this.allowRetriveCache['bouteilles'] = true;
        }

        return future.routeConfig === curr.routeConfig;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);

        if (this.allowRetriveCache[path]) {
            return this.storedRouteHandles.has(this.getPath(route));
        }

        return false;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        if (this.allowRetriveCache.hasOwnProperty(path)) {
            return true;
        }

        return false;
    }

    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        this.storedRouteHandles.set(this.getPath(route), detachedTree);
    }

    private getPath(route: ActivatedRouteSnapshot): string {
        if (route.routeConfig !== null && route.routeConfig.path) {
            return route.routeConfig.path;
        }

        return '';
    }
}
