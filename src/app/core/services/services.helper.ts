import { HttpHeaders } from "@angular/common/http";

export function getAuthHeader(accessToken: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${accessToken}`);

    return headers;
  }