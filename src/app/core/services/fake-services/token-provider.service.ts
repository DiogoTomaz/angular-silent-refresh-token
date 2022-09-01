import { UserToken } from '@shared/models/user-token';
import { User } from 'src/app/shared/models/user';
import { Injectable } from "@angular/core";
import { isPast, addSeconds } from 'date-fns';
import { uuid } from 'short-uuid';
import { FakeToken } from '@shared/models/fake-token';

@Injectable({
    providedIn: 'root'
  })
  export class TokenProviderService {
    private readonly knownUsers: Map<string, { password: string, user: User }> = new Map();
    private readonly loggedUsers: Map<string, UserToken> = new Map();

    constructor() {
        this.knownUsers.set('diogo_tomaz', { password: 'diogo_tomaz', user: { username: 'diogo_tomaz', firstName: 'Diogo', lastName: 'Tomaz'}});
        this.knownUsers.set('sandman', { password: 'sandman123', user: { username: 'sandman', firstName: 'Lord', lastName: 'Morpheus'}});
        this.knownUsers.set('DM_boss', { password: 'DunderMifflin', user: { username: 'DM_boss', firstName: 'Michael', lastName: 'Scott'}});
        this.knownUsers.set('QueenWesteros', { password: 'SyraxDragon', user: { username: 'QueenWesteros', firstName: 'Rhaenyra', lastName: 'Targaryen'}});
    }

    attemptLogin(userName: string, pass: string): UserToken | Error {
        const knownUser = this.knownUsers.get(userName);
        if(!knownUser || knownUser.password !== pass) {
            return new Error('Unauthorized');
        }

        this.loggedUsers.clear();
        const newToken = this.generateToken();
        const userToken = {...knownUser.user, ...newToken };
        this.loggedUsers.set(newToken.accessToken, userToken);

        return userToken;
    }

    // This is a over simplification of the renewal of the token
    // Usually one would use a refreshToken
    refreshToken(accessToken: string | null): UserToken | Error {
        const loggedUser = accessToken ? this.loggedUsers.get(accessToken) : null;

        if(!loggedUser) {
            return new Error('Unauthorized');
        }

        const newToken = this.generateToken();
        const userToken = {...loggedUser, ...newToken };

        this.loggedUsers.delete(loggedUser.accessToken);            
        this.loggedUsers.set(newToken.accessToken, userToken);

        return userToken;
    }

    logout(accessToken: string | null): boolean {
        const loggedUser = accessToken ? this.loggedUsers.get(accessToken) : null;
        // This is a over simplification of the renewal of the token
        // Usually one would use a refreshToken
        if(!loggedUser) {
            return false;
        }

        this.loggedUsers.delete(loggedUser.accessToken);

        return true;
    }

    // This is just a aux method to use on the interceptors that pretend to be the BE
    isAuthorized(accessToken: string): boolean {
        const loggedUser = this.loggedUsers.get(accessToken);
        if(!loggedUser || isPast(loggedUser.expiresAt)) {
            return false;
        }

        return true;
    }
    
    private generateToken(expiresInSeconds: number = 15): FakeToken {
        const date = new Date();
        const expiresAt = addSeconds(date, expiresInSeconds).getTime();
        return {
            accessToken: uuid(),
            expiresAt
        }
    }
  }