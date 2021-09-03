// Core modules
import { Component, OnInit } from '@angular/core';

// Third party modules
import { Subscription } from 'rxjs';

// DashboardHub Model and services
import { RepositoryService } from '@core/services/index.service';
import { IRepository, RepositoryModel } from '@shared/models/index.model';
import { take } from 'rxjs/operators';
/**
 * Configure webhooks component
 */
@Component({
  selector: 'dashboard-conifgure-webhooks',
  templateUrl: './conifgure-webhooks.component.html',
  styleUrls: ['./conifgure-webhooks.component.scss'],
})
export class ConifgureWebhooksComponent implements OnInit {

  public displayedColumns: string[] = ['fullName', 'projectLength', 'webhookUpdatedOn', 'updatedAt', 'actions'];
  public userSubscription: Subscription;
  public repositories: RepositoryModel[];

  /**
   * Life cycle method
   * @param repositoryService RepositoryService
   */
  constructor(
    private repositoryService: RepositoryService
  ) { }

  /**
   * Life cycle init method
   */
  ngOnInit(): void {
    this.repositoryService.findAllRepositories()
      .subscribe((repositories: RepositoryModel[]) => this.repositories = repositories);
  }

  /**
   * Create webhook
   */
  createWebhooks(repos: IRepository[]): void {
    this.repositoryService.createGitWebhooks(repos)
      .pipe(take(1))
      .subscribe();
  }

}
