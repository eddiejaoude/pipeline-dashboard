// Core modules
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

// Breakpoints components
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { delay } from 'rxjs/operators';

// Dashboard hub Icon register
import { MatSidenav } from '@angular/material';

// Dashboard hub models and services
import { ActivityService, AuthenticationService } from './core/services/index.service';
import { Navigation, ProfileModel } from './shared/models/index.model';

import { environment } from './../environments/environment';

/**
 * App component
 */
@Component({
  selector: 'dashboard-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {

  private ga: Function = (<any>window).ga;
  public progress: number = 0;
  public publicRoutes: Navigation[] = [
    {
      title: 'Homepage',
      route: '/',
      icon: 'home',
    },
  ];
  public privateRoutes: Navigation[] = [
    {
      title: 'My Projects',
      route: '/projects',
      icon: 'dashboard',
    },
    {
      title: 'Add Project',
      route: '/projects/create',
      icon: 'add_to_photos',
    },
    {
      title: 'Profile',
      route: '/profile',
      icon: 'person',
    },
  ];
  public generalRoutes: Navigation[] = [
    {
      title: 'Features',
      route: '/features',
      icon: 'poll',
    },
    {
      title: 'Help',
      route: '/help',
      icon: 'help_outline',
    },
    // {
    //   title: 'Terms & Conditions',
    //   route: '/terms-and-conditions',
    //   icon: 'terms_page_icon',
    // },
    // {
    //   title: 'Privacy',
    //   route: '/privacy',
    //   icon: 'privacy_page_icon',
    // },
  ];
  public adminRoutes: Navigation[] = [
    {
      title: 'List users',
      route: '/admin/users',
      icon: 'person',
    },
    {
      title: 'Configure webhooks',
      route: '/admin/webhooks',
      icon: 'dashboard',
    },
  ];
  public version: string;
  public isSmallScreen: boolean;
  public menuTriger: boolean;
  public sideNavMode: string;
  @ViewChild('sidenav') public menu: MatSidenav;

  /**
   * Life cycle method
   * @param _iconRegistry MatIconRegistry
   * @param _domSanitizer DomSanitizer
   * @param authService AuthenticationService
   * @param activityService ActivityService
   * @param breakpointObserver BreakpointObserver
   */
  constructor(
    private authService: AuthenticationService,
    private activityService: ActivityService,
    private breakpointObserver: BreakpointObserver,
    private router: Router

  ) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.menuTriger = true;
          this.isSmallScreen = true;
          this.sideNavMode = 'over';
        } else {
          this.isSmallScreen = false;
          this.sideNavMode = 'side';
        }
      });

    this.version = environment.version;
  }

  /**
   * Initializing the google analytics router events
   */
  public ngOnInit(): void {
    this.ga('create', environment.tracking , 'auto');
    this.ga('send', 'pageview');

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);

        this.ga('set', 'page', event.urlAfterRedirects);
        this.ga('send', 'pageview');
      }
    });
  }

  /**
   * Life cycle after view init method
   */
  ngAfterViewInit(): void {
    this.activityService
      .getProgressBar()
      .pipe(delay(0))
      .subscribe((progress: number) => this.progress = progress);
  }

  /**
   * Return the profile
   */
  public getProfile(): ProfileModel {
    return this.authService.profile;
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  /**
   * Login in the system
   */
  public login(): void {
    this.authService.login();
  }

  /**
   * Logout from the system
   */
  public logout(): void {
    this.authService.logout();
  }

  /**
   * Close the menu
   */
  public closeMenu(): void {
    if (this.isSmallScreen) {
      this.menu.opened = false;
    }
  }

  /**
   * Open menu
   * @param event Event
   */
  public openMenu(event: Event): void {
    event.stopPropagation();
    if (!this.isSmallScreen) {
      this.menuTriger = !this.menuTriger;
    }
  }

  /**
   * Show door bell
   */
  public showDoorbell(): void {
    (<any>window).doorbell.show();
  }
}
