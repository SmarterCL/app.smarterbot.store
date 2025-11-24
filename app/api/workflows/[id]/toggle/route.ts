import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    return NextResponse.json({
      success: true,
      id: params.id,
      status
    });
  } catch (error) {
    console.error('Error toggling workflow:', error);
    return NextResponse.json(
      { error: 'Failed to toggle workflow' },
      { status: 500 }
    );
  }
}
