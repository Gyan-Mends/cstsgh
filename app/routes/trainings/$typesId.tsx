"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import { motion } from "framer-motion"
import { BookOpen, Calendar, Clock, Users, ArrowLeft, User, Loader, AlertTriangle } from "lucide-react"
import type { TrainingInterface, TrainingTypeInterface } from "~/components/interface"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
export default function TrainingsByTypePage() {
    const { typesId } = useParams();
    const [trainings, setTrainings] = useState<TrainingInterface[]>([]);
    const [trainingType, setTrainingType] = useState<TrainingTypeInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch training type details
                const typeResponse = await axios.get(`/api/training-types?id=${typesId}`);
                if (typeResponse.data.success) {
                    setTrainingType(typeResponse.data.data);
                } else {
                    throw new Error(typeResponse.data.message || 'Training type not found');
                }

                // Fetch trainings for this type
                const trainingsResponse = await axios.get(`/api/training?typeId=${typesId}`);
                if (trainingsResponse.data.success) {
                    setTrainings(trainingsResponse.data.data);
                } else {
                    throw new Error(trainingsResponse.data.message || 'Failed to fetch trainings');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching trainings';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (typesId) {
            fetchTrainings();
        }
    }, [typesId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin h-32 w-32 text-pink-500" />
            </div>
        );
    }

    if (error || !trainingType) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Category Not Found</h3>
                    <p className="text-gray-600 mb-4">{error || 'The training category you are looking for does not exist.'}</p>
                    <Link 
                        to="/trainings" 
                        className="inline-flex items-center text-pink-600 hover:text-pink-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Training Categories
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <main className="flex-1">
                <div className="bg-gray-50 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-6">
                            <Link 
                                to="/trainings" 
                                className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Training Categories
                            </Link>
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                                {trainingType.name}
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                {trainingType.description}
                            </p>
                        </motion.div>
                    </div>
                </div>

                <section className="py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.7 }}
                        >
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
                                Available Programs ({trainings.length})
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Choose from our specialized training programs in {trainingType.name.toLowerCase()}
                            </p>
                        </motion.div>

                        {trainings.length > 0 ? (
                            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                                {trainings.map((training, index) => (
                                    <motion.div
                                        key={training._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                        className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                                    >
                                        <Link to={`/trainings/${typesId}/${training._id}`}>
                                            <div className="flex flex-col lg:flex-row">
                                                <div className="lg:w-1/3">
                                                    <img
                                                        src={training.image}
                                                        alt={training.title}
                                                        className="h-48 lg:h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/placeholder-training.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="p-6 lg:w-2/3">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                                                            {training.title}
                                                        </h3>
                                                    </div>
                                                    
                                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                                        {training.description}
                                                    </p>
                                                    
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="mr-2 h-4 w-4" />
                                                            <span>{training.date}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Clock className="mr-2 h-4 w-4" />
                                                            <span>{training.duration}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Users className="mr-2 h-4 w-4" />
                                                            <span>{training.format}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <User className="mr-2 h-4 w-4" />
                                                            <span>{training.client}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-12"
                            >
                                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No programs available yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    We're working on adding new training programs in this category. Check back soon!
                                </p>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-md hover:bg-pink-600 transition-colors"
                                >
                                    Request Custom Training
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </section>

                <section className="bg-gray-50 py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Need a Custom Training Solution?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    We can tailor our {trainingType.name.toLowerCase()} programs to meet your specific organizational needs
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        to="/contact"
                                        className="px-6 py-3 bg-pink-500 text-white font-medium rounded-md hover:bg-pink-600 transition-colors"
                                    >
                                        Get Custom Quote
                                    </Link>
                                    <Link
                                        to="/trainings"
                                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Explore Other Categories
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
} 