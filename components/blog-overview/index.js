"use client";
import { useEffect, useState } from "react";
import AddNewBlog from "../add-new-blog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

const initialBlogFormData = {
  title: "",
  description: "",
};

const BlogOverview = ({ blogList }) => {
  const [openBlogDialog, setOpenBlogDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blogFormData, setBlogFormData] = useState(initialBlogFormData);
  const [currentEditedBlogId, setCurrentEditedBlogId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  async function handleSaveBlogData() {
    try {
      const apiResponse =
        currentEditedBlogId !== null
          ? await fetch(`/api/update-blog?id=${currentEditedBlogId}`, {
              method: "PUT",
              body: JSON.stringify(blogFormData),
            })
          : await fetch("/api/add-blog", {
              method: "POST",
              body: JSON.stringify(blogFormData),
            });
      const result = await apiResponse.json();
      if (result?.success) {
        setBlogFormData(initialBlogFormData);
        setOpenBlogDialog(false);
        setLoading(false);
        setCurrentEditedBlogId(null);
        router.refresh();
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setBlogFormData(initialBlogFormData);
    }
  }

  async function handleDeleteBlogById(getCurrentId) {
    try {
      const apiResponse = await fetch(`/api/delete-blog?id=${getCurrentId}`, {
        method: "DELETE",
      });
      const result = await apiResponse.json();
      if (result?.success) router.refresh();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleEdit(getCurrentBlog) {
    setCurrentEditedBlogId(getCurrentBlog?._id);
    console.log(currentEditedBlogId);
    setBlogFormData({
      title: getCurrentBlog?.title,
      description: getCurrentBlog?.description,
    });
    setOpenBlogDialog(true);
  }

  return (
    <div className="min-h-screen flex flex-col gap-10 bg-gradient-to-r from-purple-500 to-blue-600">
      <AddNewBlog
        openBlogDialog={openBlogDialog}
        setOpenBlogDialog={setOpenBlogDialog}
        loading={loading}
        setLoading={setLoading}
        blogFormData={blogFormData}
        setBlogFormData={setBlogFormData}
        handleSaveBlogData={handleSaveBlogData}
        currentEditedBlogId={currentEditedBlogId}
        setCurrentEditedBlogId={setCurrentEditedBlogId}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mx-8">
        {blogList && blogList.length > 0 ? (
          blogList.map((blogItem, index) => (
            <Card className="p-5" key={index}>
              <CardContent>
                <CardTitle className="mb-5">{blogItem?.title}</CardTitle>
                <CardDescription>{blogItem?.description}</CardDescription>
                <div className="mt-5 flex gap-5 justidy-center items-center">
                  <Button
                    onClick={() => {
                      handleEdit(blogItem);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeleteBlogById(blogItem?._id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Label className="text-3xl font-extrabold">
            No Blog Found! Please add one
          </Label>
        )}
      </div>
    </div>
  );
};

export default BlogOverview;
