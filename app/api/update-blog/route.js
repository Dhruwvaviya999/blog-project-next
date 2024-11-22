import connectToDB from "@/database";
import Blog from "@/models/blog";
import Joi from "joi";
import { NextResponse } from "next/server";

const EditBlog = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

export async function PUT(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const getCurrentBlogId = searchParams.get("id");

    const { title, description } = await req.json();

    const { error } = EditBlog.validate({
      title,
      description,
    });

    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      });
    }

    if (!getCurrentBlogId) {
      return NextResponse.json({
        success: false,
        message: "Blog id is required",
      });
    }

    const updateCurrentBlogId = await Blog.findOneAndUpdate(
      {
        _id: getCurrentBlogId,
      },
      { title, description },
      { new: true }
    );

    if (updateCurrentBlogId) {
      return NextResponse.json({
        success: true,
        message: "Blog updated successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Error updating blog",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Error updating blog",
    });
  }
}
