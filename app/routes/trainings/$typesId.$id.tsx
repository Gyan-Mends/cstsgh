"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Users, User, CheckCircle, Loader, AlertTriangle } from "lucide-react"
import type { TrainingInterface } from "~/components/interface"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

export default function TrainingDetailPage() {
    const { typesId, id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState<TrainingInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const highlights = [
        "Expert instructors with industry experience",
        "Hands-on practical training approach", 
        "Industry-recognized certification",
        "Comprehensive training materials",
        "Post-training support and resources",
        "Flexible scheduling options"
    ];

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`/api/training?id=${id}`);
                
                if (response.data.success) {
                    setTraining(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Training not found');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching training details';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTraining();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin h-32 w-32 text-pink-500" />
            </div>
        );
    }

    if (error || !training) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Not Found</h3>
                    <p className="text-gray-600 mb-4">{error || 'The training you are looking for does not exist.'}</p>
                    <Link 
                        to={`/trainings/${typesId}`}
                        className="inline-flex items-center text-pink-600 hover:text-pink-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Training Category
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <main className="flex-1">
                <div className="bg-gray-50 py-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-6">
                            <Link 
                                to={`/trainings/${typesId}`}
                                className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Training Category
                            </Link>
                        </div>
                    </div>
                </div>

                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <h1 className="text-3xl font-bold text-gray-900 mb-6 md:text-4xl">
                                        {training.title}
                                    </h1>
                                    
                                    {training.image && (
                                        <div className="mb-8 rounded-lg overflow-hidden">
                                            <img 
                                                src={training.image} 
                                                alt={training.title}
                                                className="w-full h-64 md:h-96 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-training.jpg';
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Training Overview</h2>
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            {training.description}
                                        </p>
                                        
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                                        <ul className="space-y-3 mb-8">
                                            {highlights.map((highlight, index) => (
                                                <li key={index} className="flex items-start">
                                                    <CheckCircle className="mr-3 h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-600">{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-8"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Details</h3>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center">
                                            <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Date</p>
                                                <p className="text-sm text-gray-600">{training.date}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <Clock className="mr-3 h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Duration</p>
                                                <p className="text-sm text-gray-600">{training.duration}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <Users className="mr-3 h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Format</p>
                                                <p className="text-sm text-gray-600">{training.format}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <User className="mr-3 h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Client</p>
                                                <p className="text-sm text-gray-600">{training.client}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <button 
                                            onClick={() => navigate("/contact")} 
                                            className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Contact Us
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
} 