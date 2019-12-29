// Core modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Dashboard hub components
import { EditTokenResolver } from '@core/resolvers/edit-token.resolver';
import { TokensResolver } from '@core/resolvers/tokens.resolver';
import { TokensListComponent } from './tokens-list/tokens-list.component';

// Dashboard hub authentication guards
import { ViewProjectResolver } from '@app/core/resolvers/view-project.resolver';
import { AuthGuard } from '@core/guards/authentication.guard';
import { TokensCreateEditComponent } from './tokens-create-edit/tokens-create-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TokensListComponent,
    canActivate: [AuthGuard],
    resolve: { tokens: TokensResolver, project: ViewProjectResolver },
  },
  {
    path: 'create',
    component: TokensCreateEditComponent,
    canActivate: [AuthGuard],
    resolve: { project: ViewProjectResolver },
  },
  {
    path: ':uid/edit',
    component: TokensCreateEditComponent,
    canActivate: [AuthGuard],
    resolve: { token: EditTokenResolver, project: ViewProjectResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokensRoutingModule { }
