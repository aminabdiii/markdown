import { NextResponse } from 'next/server';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  title: z.string(),
  description: z.string(),
  age: z.number(),
});

export type CreateUserBody = z.infer<typeof CreateUserSchema>;

export async function GET(request: Request) {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  const json = await request.json();

  const result = CreateUserSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, json });
}
