import { Routes } from '@angular/router';
import { HomeComponent } from './control/features/components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    { path: '**', redirectTo: '' }
];
