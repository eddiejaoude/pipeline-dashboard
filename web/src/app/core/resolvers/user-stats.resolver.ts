// Core modules
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

// Third party modules
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// Dashboard hub model and services
import { UserService } from '@core/services/index.service';
import { UserStatsModel } from '@shared/models/index.model';

@Injectable({
  providedIn: 'root',
})
export class UserStatsResolver implements Resolve<UserStatsModel[]> {

  /**
   * Life cycle method
   * @param userService userService
   */
  constructor(
    private userService: UserService
  ) { }

  /**
   * Find all project data before showing projects page
   * @param route ActivatedRouteSnapshot
   */
  resolve(route: ActivatedRouteSnapshot): Observable<UserStatsModel[]> {
    return this.userService.findAllUserStats()
      .pipe(
        take(1)
      );
  }
}
