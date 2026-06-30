import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    
    if (!image || !(image instanceof File)) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'ImgBB API Key is not configured on the server.' }, { status: 500 });
    }

    // Prepare ImgBB form data
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', image);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ImgBB response failed:', errorText);
      return NextResponse.json({ success: false, error: 'Failed to upload to ImgBB' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Proxy upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
