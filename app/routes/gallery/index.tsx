"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, AlertTriangle, Info } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface GalleryInterface {
    _id: string;
    title: string;
    type: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [galleryImages, setGalleryImages] = useState<GalleryInterface[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/gallery');
                
                if (response.data.success) {
                    setGalleryImages(response.data.data);
                } else {
                    toast.error(response.data.message || 'Failed to fetch gallery images');
                }
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'An error occurred while fetching gallery images');
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryImages();
    }, []);

    // Filter images based on the selected category
    const filteredImages =
        selectedCategory === "All"
            ? galleryImages
            : galleryImages.filter((image) => image.type === selectedCategory);

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
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                                Gallery
                            </h1>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                Browse photos from our events, training programs, and corporate
                                activities
                            </p>
                        </motion.div>
                    </div>
                </div>

                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="mb-8 flex flex-wrap items-center justify-center gap-4"
                        >
                            {["All", "Events", "Training", "Corporate", "Services"].map(
                                (category, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`rounded-full px-6 py-2 text-sm font-medium ${selectedCategory === category
                                            ? "bg-pink-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                )
                            )}
                        </motion.div>

                        {filteredImages.length === 0 ? (
                            <div className="text-center mt-12">
                                <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Available</h3>
                                <p className="text-gray-600">
                                    {selectedCategory === "All" 
                                        ? "There are currently no images in the gallery."
                                        : `No images available in the ${selectedCategory} category.`
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                                {filteredImages.map((image, index) => (
                                    <motion.div
                                        key={image._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.05 * index }}
                                        className="group cursor-pointer overflow-hidden rounded-lg border"
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <div className="relative h-64 w-full">
                                            <img
                                                src={image.image}
                                                alt={image.title}
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-gallery.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="text-sm font-medium text-pink-500">
                                                {image.type}
                                            </p>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {image.title}
                                            </h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Lightbox */}
                {selectedImage !== null && filteredImages[selectedImage] && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-4">
                        <button
                            className="absolute right-4 top-4 rounded-full bg-white p-2 text-gray-900 hover:bg-gray-100 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div className="relative">
                            <img
                                src={filteredImages[selectedImage].image}
                                alt={filteredImages[selectedImage].title}
                                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
                            />
                            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded">
                                <p className="text-sm font-medium">{filteredImages[selectedImage].title}</p>
                                <p className="text-xs text-gray-300">{filteredImages[selectedImage].type}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
