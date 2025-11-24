/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  validateRequest,
  ValidationError,
} from '@/client/lib/validate_request';
import {
  createUserBodySchema,
  getUserQuerySchema,
  userIdParamsSchema,
} from '@/client/lib/schemas';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const url = new URL(request.url);
  const startTime = Date.now();

  try {
    const urlParams = await context.params;

    const { body, query, params } = await validateRequest(
      request,
      {
        body: createUserBodySchema,
        query: getUserQuerySchema,
        params: userIdParamsSchema,
      },
      urlParams
    );
    console.log('✅ Validated Data:', { body, query, params });

    const updatedUser = { id: params.userId, ...body };

    return NextResponse.json(
      {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    if (error instanceof ValidationError) {
      const errorResponse = {
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
        timestamp: new Date().toISOString(),
        path: url.pathname,
        responseTime: `${responseTime}ms`,
      };

      console.error('❌ Validation Error:', {
        url: url.pathname,
        errors: error.errors,
        userAgent: request.headers.get('user-agent'),
      });

      return NextResponse.json(errorResponse, {
        status: error.statusCode,
      });
    }

    console.error('💥 Unexpected Error:', error);

    return NextResponse.json(
      {
        statusCode: 500,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        path: url.pathname,
        responseTime: `${responseTime}ms`,
      },
      { status: 500 }
    );
  }
}
