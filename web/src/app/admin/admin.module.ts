// Core modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// DashboardHub modules and components
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { ConifgureWebhooksComponent } from './conifgure-webhooks/conifgure-webhooks.component';
import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  declarations: [UsersListComponent, ConifgureWebhooksComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
  ],
})
export class AdminModule { }
