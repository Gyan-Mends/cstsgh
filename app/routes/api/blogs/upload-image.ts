import { type ActionFunction } from "react-router";
import fs from 'node:fs';
import path from 'node:path';

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method !== 'POST') {
      return Response.json({ success: false, message: 'Method not allowed' }, { status: 405 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return Response.json({ success: false, message: 'Invalid file type. Only images and videos are allowed.' }, { status: 400 });
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, message: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    // Return the URL for the uploaded file
    const fileUrl = `/uploads/${fileName}`;

    return Response.json({ 
      success: true, 
      url: fileUrl,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      message: 'File uploaded successfully' 
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to upload file' 
    }, { status: 500 });
  }
}; 