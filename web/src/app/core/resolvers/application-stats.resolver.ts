// Core modules
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

// Third party modules
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// Dashboard hub model and services
import { StatsModel } from '@shared/models/index.model';
import { ApplicationService } from '../services/application.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationStatsResolver implements Resolve<StatsModel> {

  /**
   * Life cycle method
   * @param applicationService ApplicationService
   */
  constructor(
    private applicationService: ApplicationService
  ) { }

  /**
   * Find all project data before showing projects page
   * @param route ActivatedRouteSnapshot
   */
  resolve(route: ActivatedRouteSnapshot): Observable<StatsModel> {
    return this.applicationService.getApplicationStats()
      .pipe(
        take(1)
      );
  }
}
