// Core modules
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Breakpoints components
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

// Dashboard hub model and services
import { ApplicationService, ProjectService, UserService } from '@core/services/index.service';
import { IProject, ProjectModel, StatsModel, UserStatsModel } from '@shared/models/index.model';
import { Subscription } from 'rxjs';

/**
 * Homepage component
 */
@Component({
  selector: 'dashboard-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  private projectSubscription: Subscription;
  private popularProjectSubscription: Subscription;
  private applicationStatsSubscription: Subscription;

  public projects: IProject[] = [];
  public popularProjects: IProject[] = [];
  public users: UserStatsModel[] = [];
  public title: string = 'Public Projects';
  public isSmallScreen: boolean;
  public activeuserTable: string[] = ['avatar', 'title', 'description'];
  public projectTable: string[] = ['icon', 'title', 'description'];
  public applicationStats: StatsModel;

  /**
   * Life cycle method
   * @param route ActivatedRoute
   * @param breakpointObserver BreakpointObserver
   */
  constructor(
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private projectService: ProjectService,
    private applicationService: ApplicationService
  ) { }

  /**
   * Life cycle init method. Initialization of all parameteres
   */
  ngOnInit(): void {
    this.route.data.subscribe((data: {
      projects: ProjectModel[],
      popularProjects: ProjectModel[],
      userStats: UserStatsModel[],
      applicationStats: StatsModel
    }) => {
      this.projects = data.projects;
      this.popularProjects = data.popularProjects;
      this.users = data.userStats;
      this.applicationStats = data.applicationStats;
    });

    this.userSubscription = this.userService
      .findAllUserStats()
      .subscribe((users: UserStatsModel[]) => this.users = users);
    this.popularProjectSubscription = this.projectService
      .getPopularProjects()
      .subscribe((popularProjects: IProject[]) => this.popularProjects = popularProjects);
    this.projectSubscription = this.projectService
      .findPublicProjects()
      .subscribe((projects: IProject[]) => this.projects = projects);
    this.applicationStatsSubscription = this.applicationService
    .getApplicationStats()
    .subscribe((stats: StatsModel) => this.applicationStats = stats);

    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.activeuserTable = ['avatar', 'title'];
          this.projectTable = ['icon', 'title', 'shortDescription'];
          this.isSmallScreen = true;
        } else {
          this.activeuserTable = ['avatar', 'title', 'description'];
          this.projectTable = ['icon', 'title', 'description'];
          this.isSmallScreen = false;
        }
      });
  }

  /**
   * Life cycle destroy method
   */
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.projectSubscription.unsubscribe();
    this.popularProjectSubscription.unsubscribe();
    this.applicationStatsSubscription.unsubscribe();
  }

  /**
   * Returns the project type if private or public
   * @param project project
   */
  public checkTypeOfProject(project: ProjectModel): string {
    return project.isPrivate() ? 'lock' : 'lock_open';
  }
}
