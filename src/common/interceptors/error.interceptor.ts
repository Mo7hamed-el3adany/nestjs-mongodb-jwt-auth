import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((e) => {
        if (e && e.code && e.details) {
          return of(this.handleError(e.code, e.details));
        }
        throw e;
      }),
    );
  }

  private handleError(code: number, message: string) {
    switch (code) {
      case 400:
        throw new BadRequestException(message);
      case 401:
        throw new UnauthorizedException(message);
      case 404:
        throw new NotFoundException(message);
      case 409:
        throw new ConflictException(message);
      default:
        throw new InternalServerErrorException();
    }
  }
}
