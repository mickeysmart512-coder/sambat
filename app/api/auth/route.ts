import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, type } = body;

    // This is a mock auth. In a real app, you'd check a database and hash passwords.
    // For now, any login is successful and returns a mock user.
    
    if (type === 'login') {
      return NextResponse.json({
        user: { id: 'usr-1', email, fullName: 'John Doe' },
        token: 'mock-jwt-token',
        message: 'Login successful'
      });
    } else {
      return NextResponse.json({
        user: { id: 'usr-2', email, fullName: body.fullName || 'New User' },
        token: 'mock-jwt-token',
        message: 'Account created successfully'
      }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
