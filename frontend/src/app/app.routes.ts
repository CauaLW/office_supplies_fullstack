import { Routes } from '@angular/router';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { PendingListComponent } from './pending-list/pending-list.component';
import { JudgeRequestComponent } from './judge-request/judge-request.component';

export const routes: Routes = [
    { path: 'admin', component: RequestsListComponent },
    { path: 'judge', component: PendingListComponent },
    { path: 'judge/:id', component: JudgeRequestComponent },
    { path: 'create', component: CreateRequestComponent }
];
