import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Dashboard hub components
import { FeaturesComponent } from './components/features/features.component';
import { HelpComponent } from './components/help/help.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { PrivacyComponent } from './components/legal/privacy/privacy.component';
import { TermsConditionsComponent } from './components/legal/terms-conditions/terms-conditions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MainComponent } from './main.component';

// Dashboard hub authentication guards
import { AuthGuard } from '@core/guards/authentication.guard';
import { ApplicationStatsResolver } from '@core/resolvers/application-stats.resolver';
import { HelpResolver } from '@core/resolvers/help.resolver';
import { PopularProjectsResolver } from '@core/resolvers/popular-projects.resolver';
import { PublicProjectResolver } from '@core/resolvers/public-projects.resolver';
import { UserStatsResolver } from '@core/resolvers/user-stats.resolver';
import { FollowingComponent } from './components/following/following.component';
import { HelpDetailComponent } from './components/help-detail/help-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HomepageComponent,
        resolve: {
          projects: PublicProjectResolver,
          popularProjects: PopularProjectsResolver,
          userStats: UserStatsResolver,
          applicationStats: ApplicationStatsResolver,
        },
      },
      {
        path: 'profile',
        pathMatch: 'full',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'features',
        pathMatch: 'full',
        component: FeaturesComponent,
      },
      {
        path: 'following',
        pathMatch: 'full',
        component: FollowingComponent,
      },
      {
        path: 'help',
        pathMatch: 'full',
        component: HelpComponent,
      },
      {
        path: 'help/:path',
        pathMatch: 'full',
        component: HelpDetailComponent,
        resolve: [HelpResolver],
      },
      {
        path: 'terms-and-conditions',
        pathMatch: 'full',
        component: TermsConditionsComponent,
      },
      {
        path: 'privacy',
        pathMatch: 'full',
        component: PrivacyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
