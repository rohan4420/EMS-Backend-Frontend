import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const errors = inject(ErrorHandlerService);

  return next(request).pipe(
    catchError((error: unknown) => {
      errors.report(getErrorMessage(error));
      return throwError(() => error);
    }),
  );
};

function getErrorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'An unexpected error occurred. Please try again.';
  }

  const payload: unknown = error.error;
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message;
  }

  if (error.status === 0) {
    return 'The service could not be reached. Check your connection and try again.';
  }

  return `The request could not be completed (HTTP ${error.status}).`;
}
