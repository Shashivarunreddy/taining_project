import { Routes } from '@angular/router';
import { SigninComponent } from '../components/signin/signin.component';
import { AppComponent } from './app.component';
import { SignupComponent } from '../components/signup/signup.component';
import { Notfound404Component } from '../ui/notfound404/notfound404.component';

export const routes: Routes = [
  { path: 'home', component: AppComponent }, // Default route
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', component: Notfound404Component }, // Wildcard
];
