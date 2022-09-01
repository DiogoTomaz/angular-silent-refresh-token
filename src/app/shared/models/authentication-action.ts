import { UserToken } from './user-token';

export const AuthenticationStatus = {
    NoUser: 'NoUser',
    LoggedIn: 'LoggedIn',
    LoggedOut: 'LoggedOut'
} as const;
export type AuthenticationStatusKey = keyof typeof AuthenticationStatus;

export class AuthenticationAction {
    public readonly status: AuthenticationStatusKey;
    public readonly user: UserToken | null;

    private constructor(status: AuthenticationStatusKey, user: UserToken | null = null) {
        this.status = status;
        this.user = user;
    }

    static NoUser(): AuthenticationAction {
        return new AuthenticationAction(AuthenticationStatus.NoUser)
    }

    static LoggedIn(user: UserToken): AuthenticationAction {
        if(!user) {
            throw new Error('Parameter user was not supplied');
        }
        return new AuthenticationAction(AuthenticationStatus.LoggedIn, user);
    }

    static LoggedOut(user: UserToken): AuthenticationAction {
        if(!user) {
            throw new Error('Parameter user was not supplied');
        }
        return new AuthenticationAction(AuthenticationStatus.LoggedOut, user);
    }
}