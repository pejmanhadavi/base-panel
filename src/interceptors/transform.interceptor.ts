import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
      map((data) => {
        if (typeof data === 'string')
          return {
            success: true,
            message: data,
            timestamp: new Date().toISOString(),
          };
        return {
          result: data.length,
          success: true,
          timestamp: new Date().toISOString(),
          data,
        };
      }),
    );
  }
}
