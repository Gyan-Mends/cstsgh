"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, MapPin, Users, User, Share2, Facebook, Twitter, Linkedin, Loader, AlertTriangle, CheckCircle } from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

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

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<EventInterface | null>(null);
    const [relatedEvents, setRelatedEvents] = useState<EventInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch the specific event
                const eventResponse = await axios.get(`/api/events?id=${id}`);
                
                if (eventResponse.data.success) {
                    setEvent(eventResponse.data.data);
                    
                    // Fetch related events (excluding current event)
                    const relatedResponse = await axios.get('/api/events');
                    if (relatedResponse.data.success) {
                        const allEvents = relatedResponse.data.data.filter((e: EventInterface) => e._id !== id);
                        setRelatedEvents(allEvents.slice(0, 3)); // Show 3 related events
                    }
                } else {
                    throw new Error(eventResponse.data.message || 'Event not found');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching event details';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventData();
        }
    }, [id]);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = event?.title || '';

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

    const handleRegistration = () => {
        // Navigate to contact page or show registration form
        navigate('/contact');
        toast.success('Please contact us for event registration details');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin h-32 w-32 text-pink-500" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Not Found</h3>
                    <p className="text-gray-600 mb-4">{error || 'The event you are looking for does not exist.'}</p>
                    <Link 
                        to="/events" 
                        className="inline-flex items-center text-pink-600 hover:text-pink-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Events
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
                                to="/events" 
                                className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-6"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Events
                            </Link>
                            
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                                {event.title}
                            </h1>
                            
                            <div className="mt-6 flex flex-wrap items-center gap-6 text-gray-600">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    <span className="font-medium">
                                        {new Date(event.date).toLocaleDateString('en-US', { 
                                            weekday: 'long',
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                </div>
                                
                                {event.duration && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-5 w-5" />
                                            <span>{event.duration}</span>
                                        </div>
                                    </>
                                )}
                                
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center">
                                    <MapPin className="mr-2 h-5 w-5" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-3">
                            {/* Event Content */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7 }}
                                >
                                    {/* Featured Image */}
                                    {event.image && (
                                        <div className="mb-8 rounded-lg overflow-hidden">
                                            <img 
                                                src={event.image} 
                                                alt={event.title}
                                                className="w-full h-64 md:h-96 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-event.jpg';
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Event Description */}
                                    <div className="prose prose-lg max-w-none">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
                                        <div 
                                            dangerouslySetInnerHTML={{ __html: event.description }}
                                            className="text-gray-700 leading-relaxed"
                                        />
                                    </div>
                                    
                                    {/* Event Highlights */}
                                    <div className="mt-12">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Event Highlights</h3>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {[
                                                "Expert speakers and industry professionals",
                                                "Networking opportunities with peers",
                                                "Hands-on workshops and interactive sessions",
                                                "Professional development and learning",
                                                "Certificate of attendance",
                                                "Refreshments and materials included"
                                            ].map((highlight, index) => (
                                                <div key={index} className="flex items-start">
                                                    <CheckCircle className="mr-3 h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700">{highlight}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Share Section */}
                                    <div className="mt-12 pt-8 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">Share this event</h3>
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

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.3 }}
                                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-8"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-start">
                                            <Calendar className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Date & Time</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(event.date).toLocaleDateString('en-US', { 
                                                        weekday: 'long',
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </p>
                                                {event.duration && (
                                                    <p className="text-sm text-gray-600">Duration: {event.duration}</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <MapPin className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Location</p>
                                                <p className="text-sm text-gray-600">{event.location}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <Users className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Organizer</p>
                                                <p className="text-sm text-gray-600">CSTS Ghana</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <button 
                                            onClick={handleRegistration}
                                            className="w-full px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors mb-4"
                                        >
                                            Register for Event
                                        </button>
                                        
                                        <p className="text-xs text-gray-500 text-center">
                                            Contact us for registration details and availability
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Related Events Section */}
                        {relatedEvents && relatedEvents.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.5 }}
                                className="mt-16 pt-12 border-t border-gray-200"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Events</h2>
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {relatedEvents.map((relatedEvent, index) => (
                                        <Link 
                                            key={index}
                                            to={`/events/${relatedEvent._id}`}
                                            className="group block"
                                        >
                                            <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                                {relatedEvent.image && (
                                                    <div className="aspect-w-16 aspect-h-9">
                                                        <img 
                                                            src={relatedEvent.image} 
                                                            alt={relatedEvent.title}
                                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/placeholder-event.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-6">
                                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        <span>{new Date(relatedEvent.date).toLocaleDateString()}</span>
                                                        {relatedEvent.location && (
                                                            <>
                                                                <span className="mx-2">•</span>
                                                                <MapPin className="mr-1 h-3 w-3" />
                                                                <span className="truncate">{relatedEvent.location}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2 mb-3">
                                                        {relatedEvent.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-3">
                                                        {relatedEvent.description?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                                    </p>
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