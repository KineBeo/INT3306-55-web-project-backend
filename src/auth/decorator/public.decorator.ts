import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (summary?: string) => {
  if (summary) {
    return applyDecorators(
      SetMetadata(IS_PUBLIC_KEY, true),
      ApiOperation({ summary: `PUBLIC: ${summary}` })
    );
  }
  return SetMetadata(IS_PUBLIC_KEY, true);
};
