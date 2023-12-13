import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

export interface IRecyclePoint {
    lat: number;
    lng: number;
    addedBy: string;
    dateAdded: string;
    pointType: 'recycling' | 'collection';
    acceptedMaterials: {
        metal: boolean;
        glass: boolean;
        paper: boolean;
        plastic: boolean;
        batteries: boolean;
        electronics: boolean;
        oil: boolean;
        others: boolean;
    };
}

export interface IUser {
    reputation: number;
    password: string; // Notă: Stocarea parolelor ar trebui să fie securizată și hash-uită
    username: string;
    createdAt: string;
}

@Injectable()
export class FirebaseService {

    recyclePointsFeed: Observable<IRecyclePoint[]>;
    usersFeed: Observable<IUser[]>;

    constructor(public db: AngularFireDatabase) {

    }

    connectToDatabase() {
        this.recyclePointsFeed = this.db.list<IRecyclePoint>('recyclePoints').valueChanges();
        this.usersFeed = this.db.list<IUser>('users').valueChanges();
    }

    getRecyclePointsFeed() {
        return this.recyclePointsFeed;
    }

    getUsersFeed() {
        return this.usersFeed;
    }

    addRecyclePoint(point: IRecyclePoint) {
        this.db.list('recyclePoints').push(point);
    }

    addUser(user: IUser) {
        this.db.list('users').push(user);
    }

    // Alte metode pot fi adăugate aici
}
