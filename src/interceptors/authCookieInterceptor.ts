import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class authCookieInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        return next.handle().pipe(
            tap((data) => {
                if (data && data.token) {
                    response.cookie('access_token', data.token, {
                        httpOnly: true,         // ✅ prevent JS access
                        secure: true,           // ✅ must be true in production (HTTPS)
                        sameSite: 'none',       // ✅ required for cross-domain
                        path: '/',              // usually fine
                        maxAge: 86400000,
                    });
                    delete data.token;
                }
            }),
        );
    }
}
