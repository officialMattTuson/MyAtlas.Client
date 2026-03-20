import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "map",
        pathMatch: "full"
    },
    {
        path: "map",
        loadComponent: () =>
            import('./map/components/display-map/display-map')
                .then((m => m.DisplayMap))
    }
];
