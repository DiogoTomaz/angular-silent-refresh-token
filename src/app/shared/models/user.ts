export interface User {
    username: string,
    firstName: string,
    lastName: string
}

export function isUser(x: any): x is User {
    return (
        (x as User).username !== undefined &&
        (x as User).firstName !== undefined &&
        (x as User).lastName !== undefined
    );
};