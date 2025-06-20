"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, AlertTriangle, Info, Calendar } from "lucide-react"
import axios from "axios"

interface ComplianceNoticeInterface {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export default function ComplianceNoticesPage() {
    const [notices, setNotices] = useState<ComplianceNoticeInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/notices');
                
                if (response.data.success) {
                    setNotices(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to fetch notices');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'An error occurred while fetching notices');
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Notices</h3>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <main className="flex-1">
                <section className="bg-white py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Compliance Notices</h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                Stay updated with the latest regulatory requirements and compliance notices affecting businesses in Ghana.
                            </p>
                        </motion.div>

                        {notices.length === 0 ? (
                            <div className="text-center mt-12">
                                <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notices Available</h3>
                                <p className="text-gray-600">There are currently no compliance notices to display.</p>
                            </div>
                        ) : (
                            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
                                {notices.map((resource, index) => (
                                    <motion.div
                                        key={resource._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:transform-3d"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center">
                                                <FileText className="h-6 w-6 text-pink-500 mr-2" />
                                                <h3 className="text-xl font-semibold text-gray-900">{resource.title}</h3>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {new Date(resource.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div 
                                            className="text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: truncateText(resource.description, 300) }} 
                                        />
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



