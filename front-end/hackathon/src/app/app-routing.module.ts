import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReviewComponent } from './review/review.component';
import { CountyDetailsComponent } from './county-details/county-details.component';
import { AlertComponent } from './alert/alert.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent},
  {path:'review',component: ReviewComponent},
  {path:'alert',component: AlertComponent },
  {path:'subscribe',component: SubscribeComponent },
  { path: 'county-details/:countyId', component: CountyDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
