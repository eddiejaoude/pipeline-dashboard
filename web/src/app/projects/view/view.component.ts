import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

// Thid party modules
import { Subscription } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

// DashboardHub
import { AuthenticationService, ProjectService } from '@core/services/index.service';
import { DialogConfirmationComponent } from '@shared/dialog/confirmation/dialog-confirmation.component';
import { DialogListComponent } from '@shared/dialog/list/dialog-list.component';
import { ProjectModel, RepositoryModel } from '@shared/models/index.model';

@Component({
  selector: 'dashboard-projects-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})

export class ViewProjectComponent implements OnInit, OnDestroy {

  private dialogRef: MatDialogRef<DialogConfirmationComponent>;
  private deleteSubscription: Subscription;
  private projectSubscription: Subscription;
  public typeIcon: string;
  public project: ProjectModel;
  public isMenuOpen: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private authService: AuthenticationService
  ) {
    this.route.data.subscribe((data: { project: ProjectModel }) => this.project = data.project);
  }

  ngOnInit(): void {
    this.projectSubscription = this.projectService
      .findOneById(this.route.snapshot.params.projectUid)
      .subscribe((project: ProjectModel) => {
        this.project = project;
        if (!this.project.logoUrl) {
          this.project.logoUrl = 'https://cdn.dashboardhub.io/logo/favicon.ico';
        }
        if (this.project.type === 'private') {
          this.typeIcon = 'private_icon';
        } else if (this.project.type === 'public') {
          this.typeIcon = 'public_icon';
        }
      }
      );
  }

  // This function add  the repository
  addRepository(): void {
    this.dialog
      .open(DialogListComponent, {
        data: {
          project: this.project,
          repositories: this.authService.profile.repositories,
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((selectedRepositories: { value: RepositoryModel }[]) => !!selectedRepositories),
        switchMap((selectedRepositories: { value: RepositoryModel }[]) => this.projectService.saveRepositories(
          this.project,
          selectedRepositories.map((item: { value: RepositoryModel }) => item.value).filter((value: RepositoryModel) => value.uid)
        ))
      )
      .subscribe();
  }

  // This function delete the project
  delete(): void {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig = {
      width: '500px',
      data: {
        title: 'Delete Project',
        content: 'Are you sure you want to delete?',
      },
    };
    this.dialogRef = this.dialog.open(DialogConfirmationComponent, dialogConfig);
    this.dialogRef.afterClosed()
      .subscribe((result: boolean) => {
        if (result === true) {
          this.projectSubscription.unsubscribe();
          this.deleteSubscription = this.projectService
            .delete(this.project.uid)
            .subscribe(() => this.router.navigate(['/projects']));
        }
      });
  }

  // This function check if logged in user is also owner of the project
  isAdmin(): boolean {
    return this.project.isAdmin(this.authService.profile.uid);
  }

  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnDestroy(): void {
    this.projectSubscription.unsubscribe();
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }
}
