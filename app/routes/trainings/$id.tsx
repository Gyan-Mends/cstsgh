"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Users, MapPin, Phone, Mail, AlertTriangle, Loader } from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

interface TrainingInterface {
    _id: string;
    title: string;
    description: string;
    date: string;
    duration: string;
    format: string;
    image: string;
    client: string;
    trainingType?: string;
    trainingTypeId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function TrainingDetailPage() {
    const { id } = useParams();
    const [training, setTraining] = useState<TrainingInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/training?id=${id}`);
                
                if (response.data.success) {
                    setTraining(response.data.data);
                } else {
                    setError(response.data.message || 'Training not found');
                    toast.error('Training not found');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'An error occurred while fetching training details';
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
                        to="/trainings" 
                        className="inline-flex items-center text-pink-600 hover:text-pink-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Trainings
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
                        src={training.image}
                        alt={training.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-training.jpg';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative z-10 flex h-full items-center">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <Link 
                                    to="/trainings" 
                                    className="inline-flex items-center text-white hover:text-pink-200 mb-4"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Trainings
                                </Link>
                                <h1 className="text-4xl font-bold text-white md:text-5xl">
                                    {training.title}
                                </h1>
                                <p className="mt-4 text-xl text-white/90">
                                    Professional training program designed to enhance your skills
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Training</h2>
                                    <div 
                                        className="prose prose-lg max-w-none text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: training.description }}
                                    />
                                </motion.div>

                                {/* Training Features */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="mt-12"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">What You'll Learn</h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {[
                                            "Industry best practices and methodologies",
                                            "Practical skills for immediate application",
                                            "Real-world case studies and examples",
                                            "Interactive learning experiences",
                                            "Networking opportunities with peers",
                                            "Professional certification upon completion"
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-start">
                                                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="sticky top-8"
                                >
                                    {/* Training Details Card */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Training Details</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <Calendar className="h-5 w-5 text-pink-500 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Date</p>
                                                    <p className="font-medium text-gray-900">
                                                        {new Date(training.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Clock className="h-5 w-5 text-pink-500 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Duration</p>
                                                    <p className="font-medium text-gray-900">{training.duration}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Users className="h-5 w-5 text-pink-500 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Format</p>
                                                    <p className="font-medium text-gray-900">{training.format}</p>
                                                </div>
                                            </div>

                                            {training.client && (
                                                <div className="flex items-center">
                                                    <MapPin className="h-5 w-5 text-pink-500 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Target Audience</p>
                                                        <p className="font-medium text-gray-900">{training.client}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact Card */}
                                    <div className="bg-pink-50 rounded-lg border border-pink-200 p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Interested in This Training?</h3>
                                        <p className="text-gray-600 mb-4">
                                            Contact us to learn more about enrollment, pricing, and upcoming schedules.
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm">
                                                <Phone className="h-4 w-4 text-pink-500 mr-2" />
                                                <span className="text-gray-700">0201108331 / 0270308880</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Mail className="h-4 w-4 text-pink-500 mr-2" />
                                                <span className="text-gray-700">info@cstsghana.com</span>
                                            </div>
                                        </div>
                                        <Link
                                            to="/contact"
                                            className="inline-flex items-center w-full justify-center mt-4 rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 transition-colors"
                                        >
                                            Contact Us
                                        </Link>
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