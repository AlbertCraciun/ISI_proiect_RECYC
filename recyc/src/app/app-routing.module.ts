import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MapTestPageComponent } from './pages/map-test-page/map-test-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  // { path: 'map', component: MapPageComponent },
  { path: 'test-map', component: MapTestPageComponent },
  { path: 'auth-redirect', redirectTo: '/map', pathMatch: 'full' },
  { path: 'register', component: RegisterPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
