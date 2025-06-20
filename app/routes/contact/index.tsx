"use client"

import { useState } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Clock, Calendar, Send, ArrowRight } from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/contact', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.data.success) {
                toast.success('Thank you for your message! We\'ll get back to you soon.');
                // Clear form fields after successful submission
                setFormData({ fullname: '', email: '', phone: '', message: '' });
            } else {
                toast.error(response.data.message || 'Failed to send message');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'An error occurred while sending your message');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#333',
                    },
                    success: {
                        style: {
                            border: '1px solid #10b981',
                        },
                    },
                    error: {
                        style: {
                            border: '1px solid #ef4444',
                        },
                    },
                }}
            />
            <main className="flex min-h-screen flex-col bg-white">
                <div className="bg-gray-50 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center fade-in-up delay-200">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                                Contact Us
                            </h1>
                            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
                                Get in touch with us to discuss your corporate needs, training requirements, or any questions you may have. We're here to help you succeed.
                            </p>
                        </div>
                    </div>
                </div>

                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-2">
                            <div className="fade-in-up delay-700">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Send Us a Message</h2>
                                <p className="mt-4 text-lg text-gray-600">
                                    We'd love to hear from you. Please fill out the form below or contact us using the information provided.
                                </p>

                                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="fullname"
                                                name="fullname"
                                                required
                                                value={formData.fullname}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent h-12"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent h-12"
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent h-12"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="Enter your message"
                                        />
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex items-center rounded-md bg-pink-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-5 w-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="space-y-8 fade-in-up delay-900">
                                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                                    <div className="mt-6 space-y-4">
                                        <div className="flex">
                                            <MapPin className="mr-4 h-6 w-6 flex-shrink-0 text-pink-500" />
                                            <div>
                                                <p className="text-gray-900 font-bold">Address</p>
                                                <p className="text-gray-600">15 Netflix Street UPSA Road, Madina, Accra</p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <Mail className="mr-4 h-6 w-6 flex-shrink-0 text-pink-500" />
                                            <div>
                                                <p className="text-gray-900 font-bold">Email</p>
                                                <p className="text-gray-600">info@cstsghana.com</p>
                                                <p className="text-gray-600">ghanacsts@gmail.com</p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <Phone className="mr-4 h-6 w-6 flex-shrink-0 text-pink-500" />
                                            <div>
                                                <p className="text-gray-900 font-bold">Phone</p>
                                                <p className="text-gray-600">0201108331 / 0270308880 / 0506326541</p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <Clock className="mr-4 h-6 w-6 flex-shrink-0 text-pink-500" />
                                            <div>
                                                <p className="text-gray-900 font-bold">Business Hours</p>
                                                <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                                                <p className="text-gray-600">Saturday & Sunday: Closed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-white h-80 shadow-sm">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7940.728217336641!2d-0.165058!3d5.660366!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sgh!4v1746929755362!5m2!1sen!2sgh" 
                                        width="600" 
                                        height="450" 
                                        className="border:0; h-80 w-full rounded-lg" 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="CSTS Ghana Office Location"
                                    ></iframe>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 flex gap-6">
                                        <Calendar className="text-pink-500" /> Schedule a Meeting
                                    </h3>
                                    <p className="mt-2 text-gray-600">
                                        You can schedule a meeting with our team directly using our calendar booking system.
                                    </p>
                                    <div className="mt-4 flex space-x-4">
                                        <Link
                                            to="https://calendly.com/cstsghana"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center rounded-md h-10 px-6 py-3 text-sm font-medium text-white transition-colors w-full justify-center hover:bg-pink-600 bg-pink-500"
                                        >
                                            Schedule meeting via Calendly
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

