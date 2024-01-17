// optional: implementare mock pentru serviciul de firebase

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IRecyclePoint, IUser } from './firebase.service';

@Injectable()
export class FirebaseMockService {

    constructor() {

    }

    connectToDatabase() {
        // Mock implementation
    }

    getRecyclePointsFeed() {
        return of([] as IRecyclePoint[]);
    }

    getUsersFeed() {
        return of([] as IUser[]);
    }

    addRecyclePoint(_point: IRecyclePoint) {
        // Mock implementation
    }

    addUser(_user: IUser) {
        // Mock implementation
    }

    // Alte metode mock pot fi adăugate aici
}
