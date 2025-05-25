import { Routes } from '@angular/router';
import { HomeComponent } from './control/features/components/home/home.component';
import { StaffComponent } from './control/features/components/staff/staff.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'staff', // Ruta para el componente Staff
        component: StaffComponent
    },
    { path: '**', redirectTo: '' }
];
