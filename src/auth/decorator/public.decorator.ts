import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';
export interface PublicOptions {
  summary: string;
  description?: string;
  status?: number;
}

export const Public = (options: PublicOptions | string) => {
  const opts = typeof options === 'string' ? { summary: options } : options;
  const decorators = [
    SetMetadata(IS_PUBLIC_KEY, true),
    ApiOperation({ summary: `PUBLIC: ${opts.summary}` }),
  ];

  if (opts.description || opts.status) {
    decorators.push(
      ApiResponse({
        status: opts.status || 200,
        description: opts.description,
      }),
    );
  }

  return applyDecorators(...decorators);
};
