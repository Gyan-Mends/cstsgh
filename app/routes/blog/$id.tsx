"use client";

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import { motion } from "framer-motion"
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Loader, AlertTriangle } from "lucide-react"
import type { BlogInterface } from "~/components/interface"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

export default function BlogDetailPage() {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState<BlogInterface | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<BlogInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch the specific blog post
                const blogResponse = await axios.get(`/api/blogs?id=${id}`);
                
                if (blogResponse.data.success) {
                    const blog = blogResponse.data.data;
                    
                    // Check if the blog is published
                    if (blog.status !== 'published') {
                        throw new Error('Blog post not found');
                    }
                    
                    setBlogPost(blog);
                    
                    // Fetch related blogs (published only, excluding current blog)
                    const relatedResponse = await axios.get('/api/blogs');
                    if (relatedResponse.data.success) {
                        const published = relatedResponse.data.data.filter((b: BlogInterface) => 
                            b.status === 'published' && b._id !== id
                        );
                        setRelatedBlogs(published.slice(0, 3));
                    }
                } else {
                    throw new Error(blogResponse.data.message || 'Blog post not found');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching blog details';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogData();
        }
    }, [id]);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = blogPost?.name || '';

    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(shareTitle);
        
        let shareLink = '';
        switch (platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                break;
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
        }
        
        if (shareLink) {
            window.open(shareLink, '_blank', 'width=600,height=400');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin h-32 w-32 text-pink-500" />
            </div>
        );
    }

    if (error || !blogPost) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Post Not Found</h3>
                    <p className="text-gray-600 mb-4">{error || 'The blog post you are looking for does not exist.'}</p>
                    <Link 
                        to="/blog" 
                        className="inline-flex items-center text-pink-600 hover:text-pink-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gray-50 py-12 md:py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link 
                                to="/blog" 
                                className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-6"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Blog
                            </Link>
                            
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 text-sm font-medium text-pink-500 bg-pink-100 rounded-full">
                                    {typeof blogPost.category === 'object' ? blogPost.category.name : blogPost.category}
                                </span>
                            </div>
                            
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                                {blogPost.name}
                            </h1>
                            
                            <div className="mt-6 flex items-center text-gray-600">
                                <div className="flex items-center">
                                    <User className="mr-2 h-5 w-5" />
                                    <span className="font-medium">
                                        {typeof blogPost.admin === 'object' ? blogPost.admin.fullName || 'Admin' : 'Admin'}
                                    </span>
                                </div>
                                <span className="mx-3">•</span>
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    <span>{blogPost.createdAt ? new Date(blogPost.createdAt).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    }) : new Date().toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                </div>
                                <span className="mx-3">•</span>
                                <span>{Math.max(1, Math.ceil((blogPost.description?.length || 0) / 1000))} min read</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-4">
                            {/* Article Content */}
                            <div className="lg:col-span-3">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7 }}
                                >
                                    {/* Featured Image */}
                                    {blogPost.image && (
                                        <div className="mb-8 rounded-lg overflow-hidden">
                                            <img 
                                                src={blogPost.image} 
                                                alt={blogPost.name}
                                                className="w-full h-64 md:h-96 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-blog.jpg';
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Article Body */}
                                    <div className="prose prose-lg max-w-none">
                                        <div 
                                            dangerouslySetInnerHTML={{ __html: blogPost.description }}
                                            className="prose prose-lg prose-pink max-w-none dark:prose-invert
                                                prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                                prose-p:text-gray-700 dark:prose-p:text-gray-300
                                                prose-a:text-pink-600 hover:prose-a:text-pink-700
                                                prose-strong:text-gray-900 dark:prose-strong:text-white
                                                prose-blockquote:border-pink-500
                                                prose-img:rounded-lg prose-img:shadow-md
                                                prose-video:rounded-lg prose-video:shadow-md
                                                prose-pre:bg-gray-800 prose-pre:text-gray-100
                                                prose-code:text-pink-600 dark:prose-code:text-pink-400
                                                prose-ul:list-disc prose-ol:list-decimal"
                                        />
                                    </div>
                                    
                                    {/* Share Section */}
                                    <div className="mt-12 pt-8 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleShare('facebook')}
                                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                >
                                                    <Facebook className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleShare('twitter')}
                                                    className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                                                >
                                                    <Twitter className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleShare('linkedin')}
                                                    className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                                >
                                                    <Linkedin className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Related Articles Section */}
                        {relatedBlogs && relatedBlogs.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="mt-16 pt-12 border-t border-gray-200"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {relatedBlogs.slice(0, 3).map((relatedBlog, index) => (
                                        <Link 
                                            key={index}
                                            to={`/blog/${relatedBlog._id}`}
                                            className="group block"
                                        >
                                            <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                                {relatedBlog.image && (
                                                    <div className="aspect-w-16 aspect-h-9">
                                                        <img 
                                                            src={relatedBlog.image} 
                                                            alt={relatedBlog.name}
                                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/placeholder-blog.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-6">
                                                    <div className="mb-3">
                                                        <span className="inline-block px-2 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">
                                                            {typeof relatedBlog.category === 'object' ? relatedBlog.category.name : relatedBlog.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2 mb-3">
                                                        {relatedBlog.name}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                        {relatedBlog.description?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                                    </p>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <div className="flex items-center">
                                                            <User className="mr-1 h-3 w-3" />
                                                            <span>{typeof relatedBlog.admin === 'object' ? relatedBlog.admin.fullName || 'Admin' : 'Admin'}</span>
                                                        </div>
                                                        <span className="mx-2">•</span>
                                                        <span>{Math.max(1, Math.ceil((relatedBlog.description?.length || 0) / 1000))} min read</span>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
} 