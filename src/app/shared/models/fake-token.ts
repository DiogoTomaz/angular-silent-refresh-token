// Just a very humble representation of what a JWT Token looks like
export interface FakeToken { expiresAt: number, accessToken: string };
export function isToken(x: any): x is FakeToken {
    return (
        (x as FakeToken).expiresAt !== undefined &&
        (x as FakeToken).accessToken !== undefined
    );
};