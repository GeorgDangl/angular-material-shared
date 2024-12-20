import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: '', redirectTo: '/de', pathMatch: 'full' },
  {
    path:'de',
    loadComponent: () => import('./tinyMce-de/tinyMce-de.component').then(c => c.TinyMceDeComponent),
  },
  {
    path:'en',
    loadComponent: () => import('./tinyMce-en/tinyMce-en.component').then(c => c.TinyMceEnComponent),
  }
];
