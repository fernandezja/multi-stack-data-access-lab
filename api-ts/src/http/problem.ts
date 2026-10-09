import type { Response } from 'express';

export function problem(
  response: Response,
  status: number,
  detail: string,
  errors?: unknown
) {
  return response
    .status(status)
    .type('application/problem+json')
    .json({
      type: 'about:blank',
      title: status === 400 ? 'Validation error' : 'Error',
      status,
      detail,
      ...(errors ? { errors } : {})
    });
}
