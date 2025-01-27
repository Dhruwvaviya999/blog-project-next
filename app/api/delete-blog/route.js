import connectToDB from "@/database";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const getCurrentBlogId = searchParams.get("id");

    if (!getCurrentBlogId) {
      return NextResponse.json({
        success: false,
        message: "Blog Id is required",
      });
    }

    const deleteCurrentBlogId = await Blog.findByIdAndDelete(getCurrentBlogId);
    if (deleteCurrentBlogId) {
      return NextResponse.json({
        success: true,
        message: "Blog deleted successfully",
      });
    }
  } catch (err) {
    console.log(err);
    // return NextResponse.json({
    //   success: false,
    //   message: "Something went wrong! Please try again.",
    // });
  }
}
