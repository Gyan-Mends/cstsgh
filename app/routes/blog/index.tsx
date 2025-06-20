"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { Calendar, User, Tag, ArrowRight, AlertTriangle, Info } from "lucide-react"
import axios from "axios"

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

export default function BlogPage() {
    const [blogs, setBlogs] = useState<BlogInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/blogs');
                
                if (response.data.success) {
                    setBlogs(response.data.data.filter((blog: BlogInterface) => blog.status === 'published'));
                } else {
                    setError(response.data.message || 'Failed to fetch blogs');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'An error occurred while fetching blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Blog Posts</h3>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <main className="flex-1">
                <section className="bg-gray-50 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-center"
                        >
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Our Blog</h1>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                Stay informed with the latest insights, news, and updates from CSTS on corporate governance, training, and business development.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {blogs.length === 0 ? (
                            <div className="text-center mt-12">
                                <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Blog Posts Available</h3>
                                <p className="text-gray-600">There are currently no published blog posts to display.</p>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {blogs.map((blog, index) => (
                                    <motion.div
                                        key={blog._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.1 * index,
                                        }}
                                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:transform-3d overflow-hidden"
                                    >
                                        <Link to={`/blog/${blog._id}`}>
                                            <div className="group">
                                                <div className="h-48 w-full bg-gray-200 overflow-hidden">
                                                    <img 
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                                        src={blog.image} 
                                                        alt={blog.name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/placeholder-blog.jpg';
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div className="p-6">
                                                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {blog.createdAt && new Date(blog.createdAt).toLocaleDateString()}
                                                        </div>
                                                        {typeof blog.category === 'object' && (
                                                            <div className="flex items-center">
                                                                <Tag className="h-4 w-4 mr-1" />
                                                                {blog.category.name}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
                                                        {blog.name}
                                                    </h3>
                                                    <p className="text-gray-600 line-clamp-3 mb-4">{blog.description}</p>
                                                    
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <User className="h-4 w-4 mr-1" />
                                                            {typeof blog.admin === 'object' ? blog.admin.fullName : 'Admin'}
                                                        </div>
                                                        <ArrowRight className="h-4 w-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
} 