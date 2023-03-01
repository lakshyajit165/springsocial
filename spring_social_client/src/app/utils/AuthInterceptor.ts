import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private excludedUrls: string[] = ['/oauth2/authorize/**'];

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.cookieService.get('accessToken');

    // Skip adding authorization header for excluded URLs
    if (this.shouldExclude(request.url)) {
      return next.handle(request);
    }

    // Add authorization header for all other requests
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(request);
  }

  private shouldExclude(url: string): boolean {
    return this.excludedUrls.some(excludedUrl => {
      if (excludedUrl.endsWith('**')) {
        const prefix = excludedUrl.slice(0, -2);
        return url.startsWith(prefix);
      } else {
        return url === excludedUrl;
      }
    });
  }
  
}
