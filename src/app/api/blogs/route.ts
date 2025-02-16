/** @format */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/database';
import { mongo_uri } from '../../../../constant';
import { Blog } from '@/models/blog';

interface BlogData {
  title: string;
  description: string;
  imageURL: string;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '10');
  const page = parseInt(searchParams.get('page') || '1');
  const skip = (page - 1) * limit;

  try {
    await connectDB(mongo_uri);
    const blogs = await Blog.find().sort({ date: -1 }).skip(skip).limit(limit);
    const totalData = await Blog.countDocuments();
    return NextResponse.json({
      total: totalData,
      page,
      limit,
      data: blogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB(mongo_uri);
    const blogData: BlogData = await req.json();
    const { title, description, imageURL } = blogData;

    const newBlog = new Blog({
      title,
      description,
      imageURL,
    });
    const blog = await newBlog.save();
    return NextResponse.json(
      {
        success: true,
        message: 'Blog added successfully',
        data: blog,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
