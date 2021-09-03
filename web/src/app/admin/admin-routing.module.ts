// Core modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// DashboardHub components
import { AdminGuard } from '@core/guards/admin.guard';
import { ConifgureWebhooksComponent } from './conifgure-webhooks/conifgure-webhooks.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersListComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'webhooks',
    component: ConifgureWebhooksComponent,
    canActivate: [AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
