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
                        secure: false,
                        sameSite: 'none',
                        maxAge: 24 * 60 * 60 * 1000, // 1 day
                    });
                    delete data.token;
                }
            }),
        );
    }
}
