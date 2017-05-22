import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {GlobalVariableService} from "../global-variable.service";

@Injectable()
export class VariableResolver implements Resolve<any> {
    constructor(private router: Router, private globalVariables: GlobalVariableService) {
    }

    // todo: bad resolver implementation in app.module.ts
    resolve(next: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        if(this.globalVariables.getGlobalUser() === undefined) {
            return this.globalVariables.fetchGlobalUser(2);
        }
    }
}