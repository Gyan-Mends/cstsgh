"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, User, Tag, Share2, AlertTriangle, Loader } from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

interface BlogInterface {
    _id: string;
    name: string;
    description: string;
    image: string;
    category: string | { _id: string; name: string; description: string };
    admin: string | { _id: string; fullName: string; email: string };
    status?: 'draft' | 'review' | 'published';
    createdAt?: string;
    updatedAt?: string;
}

export default function BlogDetailPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState<BlogInterface | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<BlogInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/blogs?id=${id}`);
                
                if (response.data.success) {
                    setBlog(response.data.data);
                    // Fetch related blogs
                    const relatedResponse = await axios.get('/api/blogs');
                    if (relatedResponse.data.success) {
                        const published = relatedResponse.data.data.filter((b: BlogInterface) => 
                            b.status === 'published' && b._id !== id
                        );
                        setRelatedBlogs(published.slice(0, 3)); // Show 3 related blogs
                    }
                } else {
                    setError(response.data.message || 'Blog post not found');
                    toast.error('Blog post not found');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'An error occurred while fetching blog details';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    const sharePost = () => {
        if (navigator.share && blog) {
            navigator.share({
                title: blog.name,
                text: blog.description.substring(0, 100) + '...',
                url: window.location.href,
            }).catch(() => {
                // Fallback to copying URL
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            });
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin h-32 w-32 text-pink-500" />
            </div>
        );
    }

    if (error || !blog) {
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
                <section className="relative h-96 overflow-hidden">
                    <img
                        src={blog.image}
                        alt={blog.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-blog.jpg';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative z-10 flex h-full items-center">
                        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <Link 
                                    to="/blog" 
                                    className="inline-flex items-center text-white hover:text-pink-200 mb-4"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Blog
                                </Link>
                                
                                <div className="flex items-center gap-4 mb-4 text-white/80">
                                    {typeof blog.category === 'object' && (
                                        <div className="flex items-center">
                                            <Tag className="h-4 w-4 mr-1" />
                                            {blog.category.name}
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {blog.createdAt && new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        {typeof blog.admin === 'object' ? blog.admin.fullName : 'Admin'}
                                    </div>
                                </div>

                                <h1 className="text-4xl font-bold text-white md:text-5xl">
                                    {blog.name}
                                </h1>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="prose prose-lg max-w-none"
                        >
                            <div 
                                className="text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: blog.description }}
                            />
                        </motion.article>

                        {/* Share Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-8 pt-8 border-t border-gray-200"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>Published on {blog.createdAt && new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                    {typeof blog.admin === 'object' && (
                                        <span>by {blog.admin.fullName}</span>
                                    )}
                                </div>
                                <button
                                    onClick={sharePost}
                                    className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                                >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Related Blog Posts */}
                {relatedBlogs.length > 0 && (
                    <section className="py-16 bg-gray-50">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {relatedBlogs.map((relatedBlog, index) => (
                                        <motion.div
                                            key={relatedBlog._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.1 * index }}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
                                        >
                                            <Link to={`/blog/${relatedBlog._id}`}>
                                                <div className="group">
                                                    <div className="h-48 w-full bg-gray-200 overflow-hidden rounded-t-lg">
                                                        <img 
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                                            src={relatedBlog.image} 
                                                            alt={relatedBlog.name}
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/placeholder-blog.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                    
                                                    <div className="p-6">
                                                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                {relatedBlog.createdAt && new Date(relatedBlog.createdAt).toLocaleDateString()}
                                                            </div>
                                                            {typeof relatedBlog.category === 'object' && (
                                                                <div className="flex items-center">
                                                                    <Tag className="h-4 w-4 mr-1" />
                                                                    {relatedBlog.category.name}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
                                                            {relatedBlog.name}
                                                        </h3>
                                                        <p className="text-gray-600 line-clamp-3">{relatedBlog.description.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
} 