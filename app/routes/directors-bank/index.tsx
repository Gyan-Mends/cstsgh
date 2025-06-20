"use client"

import { useState, useEffect } from "react"
import { Users, Search, Filter, CheckCircle, User, Loader, AlertTriangle } from "lucide-react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import image1 from "~/components/image/lawyer.jpg"
import image2 from "~/components/image/hero3.jpg"

// Define director interface
interface Director {
    _id?: string;
    name: string;
    position: string;
    expertise: string[];
    experience: string;
    availability: string;
    image?: string;
}

export default function DirectorsBankPage() {
    const [directors, setDirectors] = useState<Director[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredDirectors, setFilteredDirectors] = useState<Director[]>([])
    const [filterActive, setFilterActive] = useState(false)
    const [expertiseFilter, setExpertiseFilter] = useState<string[]>([])
    const [showFilters, setShowFilters] = useState(false)

    // Fetch directors data
    useEffect(() => {
        const fetchDirectors = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get('/api/directors-bank');
                
                if (response.data.success) {
                    setDirectors(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch directors');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching directors';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchDirectors();
    }, []);

    // Get all unique expertise areas for filtering
    const allExpertiseAreas = directors ? Array.from(new Set(directors.flatMap((director) => director.expertise || []) || [])).sort() : []

    // Handle search and filtering
    const handleSearch = () => {
        if (!directors) return;
        
        let results = [...directors]

        // Filter by search query
        if (searchQuery) {
            results = results.filter(
                (director) =>
                    director?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    director?.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    director?.expertise?.some((skill) => skill?.toLowerCase().includes(searchQuery.toLowerCase())),
            )
        }
        
        // Filter by expertise if any are selected
        if (expertiseFilter.length > 0) {
            results = results.filter((director) => 
                director?.expertise?.some((skill) => expertiseFilter.includes(skill))
            )
        }

        setFilteredDirectors(results)
        setFilterActive(true)
    }

    // Reset filters
    const resetFilters = () => {
        setSearchQuery("")
        setExpertiseFilter([])
        setFilterActive(false)
        setShowFilters(false)
    }

    // Toggle expertise filter
    const toggleExpertiseFilter = (expertise: string) => {
        setExpertiseFilter((prev) =>
            prev.includes(expertise) ? prev.filter((item) => item !== expertise) : [...prev, expertise],
        )
    }

    // Update results when filters change
    useEffect(() => {
        if (searchQuery || expertiseFilter.length > 0) {
            handleSearch()
        }
    }, [searchQuery, expertiseFilter])

    // Directors to display based on filter state
    const directorsToDisplay = filterActive ? filteredDirectors : directors || []

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin h-32 w-32 text-pink-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Directors</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-md hover:bg-pink-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gray-50 py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="text-center">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                                    Directors' Bank
                                </h1>
                                <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
                                    Expert directors available to strengthen your organization's governance and strategic direction.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Search Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Find the Right Director</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Numerous clients seek the services of persons with the requisite expertise to serve as Directors of their organization especially foreign individuals and entities that intend to incorporate their companies in Ghana.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by name, expertise, or industry"
                                            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 md:w-auto"
                                    >
                                        <Filter className="mr-2 h-4 w-4" />
                                        {showFilters ? "Hide Filters" : "Show Filters"}
                                    </button>
                                </div>
                                <div>
                                    {filterActive ? (
                                        <button
                                            onClick={resetFilters}
                                            className="flex w-full items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-300 md:w-auto"
                                        >
                                            Reset
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSearch}
                                            className="flex w-full items-center justify-center rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 md:w-auto"
                                        >
                                            Search
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Expertise filters */}
                            {showFilters && (
                                <div className="mt-6 border-t border-gray-200 pt-6">
                                    <h3 className="mb-4 text-sm font-medium text-gray-700">Filter by expertise:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {allExpertiseAreas.map((expertise) => (
                                            <button
                                                key={expertise}
                                                onClick={() => toggleExpertiseFilter(expertise)}
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${expertiseFilter.includes(expertise)
                                                    ? "bg-pink-100 text-pink-800"
                                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {expertise}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Search results info */}
                        {filterActive && (
                            <div className="mt-4 text-sm text-gray-600">
                                Found {filteredDirectors.length} director{filteredDirectors.length !== 1 ? "s" : ""} matching your
                                criteria
                            </div>
                        )}

                        {/* Director Profiles */}
                        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {directorsToDisplay.map((director, index) => (
                                <motion.div
                                    key={director._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                >
                                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                        <div className="relative w-full h-48">
                                            {director?.image ? (
                                                <img
                                                    src={director.image}
                                                    alt={director.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.nextElementSibling!.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className="flex h-full w-full items-center justify-center bg-gray-200" style={{ display: director?.image ? 'none' : 'flex' }}>
                                                <User className="h-16 w-16 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-900">{director?.name || 'Unnamed Director'}</h3>
                                            <p className="text-sm font-medium text-pink-500">{director?.position || 'No Position Specified'}</p>
                                            
                                            {director?.experience && (
                                                <p className="mt-2 text-sm text-gray-600">{director.experience}</p>
                                            )}
                                            
                                            {director?.availability && (
                                                <p className="mt-2 text-sm text-gray-600 font-medium">{director.availability}</p>
                                            )}
                                            
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700">Areas of Expertise:</h4>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {director?.expertise?.length ? (
                                                        director.expertise.map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">No expertise listed</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {directorsToDisplay.length === 0 && !loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mt-8 rounded-lg border border-gray-200 bg-white p-8 text-center"
                            >
                                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No directors found</h3>
                                <p className="mt-2 text-gray-600">
                                    {filterActive ? "Try adjusting your search criteria or filters" : "No directors are currently available in our database"}
                                </p>
                                {filterActive && (
                                    <button
                                        onClick={resetFilters}
                                        className="mt-4 inline-flex items-center rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
                                    >
                                        Reset filters
                                    </button>
                                )}
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="mt-12"
                        >
                            <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                                <p className="text-gray-600">
                                    To easily assist promoters of companies as well as shareholders of these companies, CSTS is conducting a
                                    project which intends to put out persons who may be interested in serving as Directors of organizations.
                                </p>
                                <p className="mt-4 text-gray-600">
                                    All information received would only be shared with interested clients and treated in the strictest of
                                    confidence. The nature of engagement will strictly be between the Company and the would-be Director.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Director Registration Form Section */}
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 md:grid-cols-2 md:items-center">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="relative h-[50vh] overflow-hidden rounded-lg">
                                    <img
                                        className="h-[50vh] w-full object-cover rounded-lg"
                                        src={image1}
                                        alt="Director registration"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Director Registration Form</h2>
                                    <p className="mt-4 text-lg text-gray-600">
                                        Please complete the form below if you are interested in being registered in our Directors' Bank.
                                    </p>
                                    <div className="mt-8">
                                        <Link
                                            to="https://docs.google.com/forms/d/1jAzNGuriRUNJzrSpI1feBHMw53s_kevmPHXKg8l7SdY/edit"
                                            className="inline-flex items-center rounded-md bg-pink-500 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-pink-600"
                                        >
                                            Complete Registration Form
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Benefits of Using Our Directors' Bank</h2>
                        </motion.div>

                        <div className="mt-12 grid gap-6 md:grid-cols-2">
                            {[
                                "Access to qualified professionals with expertise in various industries",
                                "Simplified process for foreign companies seeking local directors",
                                "Confidential matching of companies with suitable director candidates",
                                "Support throughout the engagement process",
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                >
                                    <div className="flex items-start">
                                        <CheckCircle className="mr-3 mt-1 h-5 w-5 text-pink-500" />
                                        <p className="text-lg text-gray-700">{benefit}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Board Meeting Image Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="relative h-full w-full overflow-hidden rounded-lg">
                                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                    <img
                                        src={image2}
                                        alt="Board meeting with laptops"
                                        className="object-cover h-full w-full rounded-lg"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Need Directors Section */}
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="rounded-lg bg-white p-8 shadow-sm md:p-12">
                                <div className="md:flex md:items-center md:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Need Directors for Your Company?</h2>
                                        <p className="mt-4 max-w-3xl text-lg text-gray-600">
                                            If you are a company looking for qualified directors, please contact us to discuss your
                                            requirements.
                                        </p>
                                    </div>
                                    <div className="mt-8 md:mt-0">
                                        <Link
                                            to="/contact"
                                            className="inline-flex items-center rounded-md bg-pink-500 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-pink-600"
                                        >
                                            Contact Us
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Why Choose Our Directors' Bank Section */}
                <section className="bg-white py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Why Choose Our Directors' Bank?</h2>
                                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                    Our rigorous selection process ensures you find the right fit for your board
                                </p>
                            </div>
                        </motion.div>

                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    title: "Vetted Professionals",
                                    description:
                                        "All directors in our bank undergo a thorough vetting process to ensure they meet our high standards.",
                                },
                                {
                                    title: "Diverse Expertise",
                                    description:
                                        "Our directors bring diverse skills and experiences across various industries and functional areas.",
                                },
                                {
                                    title: "Board-Ready",
                                    description:
                                        "Our directors are trained in corporate governance and ready to contribute effectively to your board.",
                                },
                                {
                                    title: "Tailored Matching",
                                    description: "We help match directors with organizations based on specific needs and requirements.",
                                },
                                {
                                    title: "Ongoing Support",
                                    description:
                                        "We provide ongoing support to both directors and organizations to ensure successful board relationships.",
                                },
                                {
                                    title: "Confidentiality",
                                    description: "We maintain strict confidentiality throughout the director search and selection process.",
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                >
                                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-pink-50">
                                            <CheckCircle className="h-6 w-6 text-pink-500" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
