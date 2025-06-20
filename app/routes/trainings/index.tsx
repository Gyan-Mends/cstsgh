"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { BookOpen, Calendar, Clock, Users, Award, CheckCircle, ArrowRight, AlertTriangle, Info } from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

interface TrainingTypeInterface {
    _id: string;
    name: string;
    description: string;
    image: string;
    isActive: boolean;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function TrainingsPage() {
    const [trainingTypes, setTrainingTypes] = useState<TrainingTypeInterface[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainingTypes = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/training-types');
                
                if (response.data.success) {
                    // Filter only active training types
                    const activeTrainingTypes = response.data.data.filter((type: TrainingTypeInterface) => type.isActive);
                    setTrainingTypes(activeTrainingTypes);
                } else {
                    toast.error(response.data.message || 'Failed to fetch training types');
                }
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'An error occurred while fetching training types');
            } finally {
                setLoading(false);
            }
        };

        fetchTrainingTypes();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <main className="flex-1">
                <div className="bg-gray-50 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Training Programs</h1>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                Discover our comprehensive training programs designed to enhance your skills and knowledge
                            </p>
                        </motion.div>
                    </div>
                </div>

                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Training Categories</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Explore our specialized training categories and find the perfect program for your needs
                            </p>
                        </motion.div>

                        {trainingTypes.length === 0 ? (
                            <div className="text-center mt-12">
                                <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Training Types Available</h3>
                                <p className="text-gray-600">There are currently no active training types to display.</p>
                            </div>
                        ) : (
                            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {trainingTypes.map((trainingType, index) => (
                                    <motion.div
                                        key={trainingType._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                                    >
                                        <Link to={`/trainings/${trainingType._id}`}>
                                            <div className="aspect-w-16 aspect-h-9">
                                                <img
                                                    src={trainingType.image}
                                                    alt={trainingType.name}
                                                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/placeholder-training.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="p-6">
                                                {trainingType.category && (
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                                                            {trainingType.category}
                                                        </span>
                                                    </div>
                                                )}
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                                                    {trainingType.name}
                                                </h3>
                                                <p className="text-gray-600 mb-4 line-clamp-3">
                                                    {trainingType.description}
                                                </p>
                                                <div className="flex items-center text-pink-500 font-medium text-sm group-hover:text-pink-600">
                                                    View Programs
                                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-white py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Why Choose Our Training Programs?</h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                Our training programs are designed to deliver practical knowledge and skills that can be immediately
                                applied in the workplace
                            </p>
                        </motion.div>

                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: <Users className="h-8 w-8 text-pink-500" />,
                                    title: "Expert Instructors",
                                    description: "Learn from industry experts with extensive practical experience.",
                                },
                                {
                                    icon: <CheckCircle className="h-8 w-8 text-pink-500" />,
                                    title: "Practical Focus",
                                    description: "Our programs emphasize practical skills that can be immediately applied.",
                                },
                                {
                                    icon: <Award className="h-8 w-8 text-pink-500" />,
                                    title: "Recognized Certifications",
                                    description: "Earn industry-recognized certifications to advance your career.",
                                },
                                {
                                    icon: <BookOpen className="h-8 w-8 text-pink-500" />,
                                    title: "Comprehensive Materials",
                                    description: "Receive detailed course materials and resources for continued learning.",
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                    className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm"
                                >
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-50">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4 items-center justify-center py-20">
                    <p className="font-bold text-2xl">
                        Need Custom Training?
                    </p>
                    <div className="text-center">
                        <p>
                            We offer customized training programs tailored to the specific needs of your
                        </p>
                        <p>
                            organization or personal development goals.
                        </p>
                    </div>

                    <Link
                        to="/contact"
                        className="rounded-md bg-pink-500 px-6 py-3 text-sm font-medium text-white hover:bg-pink-600 transition-colors"
                    >
                        Request Custom Training
                    </Link>
                </section>
            </main>
        </div>
    )
}