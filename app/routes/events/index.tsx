"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, Users, ArrowRight, AlertTriangle, Info } from "lucide-react"
import axios from "axios"

interface EventInterface {
    _id: string;
    title: string;
    description: string;
    date: string;
    duration: string;
    location: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<EventInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/events');
                
                if (response.data.success) {
                    setEvents(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to fetch events');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'An error occurred while fetching events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Events</h3>
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
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Events & Workshops</h1>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                Join us for our upcoming events and workshops to enhance your knowledge and skills.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {events.length === 0 ? (
                            <div className="text-center mt-12">
                                <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Available</h3>
                                <p className="text-gray-600">There are currently no events scheduled to display.</p>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {events.map((event, index) => (
                                    <motion.div
                                        key={event._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.1 * index,
                                        }}
                                        className="fade-in-up delay-200 event-card border-b border-gray-300 bg-white rounded-lg pb-10 shadow-md last:border-0 hover:transform-3d"
                                    >
                                        <Link to="/404">
                                            <div className="group">
                                                <div className="mb-4 h-[33vh] w-full rounded-lg bg-gray-200 overflow-hidden">
                                                    <img 
                                                        className="rounded-tr-lg rounded-tl-lg h-[33vh] w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                                        src={event.image} 
                                                        alt={event.title}
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/placeholder-event.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2 px-2">
                                                    <div className="flex justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 w-10 bg-pink-200 rounded-md">
                                                                <Calendar className="text-pink-500 h-6 w-6" />
                                                            </div>
                                                            <p className="text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <p className="text-gray-400 text-sm">{event.location}</p>
                                                        </div>
                                                    </div>

                                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="mt-2 text-gray-600 line-clamp-3">{event.description}</p>
                                                    
                                                    {event.duration && (
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <Clock className="h-4 w-4 text-pink-500" />
                                                            <p className="text-sm text-gray-500">Duration: {event.duration}</p>
                                                        </div>
                                                    )}

                                                    <div className="mt-4 pt-2 border-t border-gray-100">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-400">
                                                                {event.createdAt && `Added ${new Date(event.createdAt).toLocaleDateString()}`}
                                                            </span>
                                                            <ArrowRight className="h-4 w-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {events.length > 0 && (
                            <div className="mt-10 flex justify-center">
                                <button className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                                    Load more events
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section className="py-10">
                    <div className="mx-auto flex flex-col justify-center items-center max-w-7xl px-4 sm:px-6 lg:px-8 w-full h-60 rounded-xl bg-white shadow-md gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h2 className="font-bold text-2xl font-montserrat mb-4">Have an idea for an event?</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                We're always looking for new ideas and collaborations for events and workshops. 
                                Reach out to us with your suggestions!
                            </p>

                            <Link 
                                className="inline-flex items-center mt-6 py-3 px-6 rounded-lg text-white bg-pink-500 hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg" 
                                to="/contact"
                            >
                                Contact Us
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    )
}

