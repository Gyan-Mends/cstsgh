import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import hero1 from "~/components/image/hero1.jpg";
import hero2 from "~/components/image/hero2.jpg";
import hero3 from "~/components/image/hero3.jpg";
import im3 from "~/components/image/lawyer.jpg"


export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0)


    const backgroundImages = [
        hero1,
        hero2,
        hero3,
      ]

    return (
      <div>
         {/* Hero Section */}
         <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background Slideshow */}
            <div className="absolute inset-0">
              {backgroundImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-[2500ms] ease-in-out transform ${
                    index === currentSlide
                      ? 'opacity-100 scale-105'
                      : 'opacity-0 scale-100'
                  }`}
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    animation: index === currentSlide ? 'smoothZoomPan 8000ms ease-in-out infinite' : 'none',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    filter: index === currentSlide ? 'brightness(1.05)' : 'brightness(1)',
                    transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1), filter 3s ease-in-out'
                  }}
                />
              ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 transition-all duration-1000"></div>

            {/* Content */}
            <div className="relative z-10 text-white px-4 sm:px-6 max-w-6xl mx-auto "> 
              {/* Main Headline */}
              <div className="">
                <h1 className="fade-in-up text-4xl font-bold  tracking-tight font-montserrat md:text-7xl  ">
                  Corporate Excellence &<br />
                </h1>
                <h1 className="fade-in-up delay-200 text-4xl mt-2 font-bold tracking-tight font-montserrat  md:text-7xl">
                  <span className="text-white">Professional</span> Training
                </h1>
                <p className="fade-in-up delay-400 mt-6 text-lg leading-relaxed text-white">
                  Strengthening the capacity of companies and entrepreneurs  in core  
                </p>
                <p className="fade-in-up delay-500 text-lg leading-relaxed text-white">
               areas such as corporate
                governance, financial management, 
                </p>
                <p className="fade-in-up delay-600 text-lg leading-relaxed text-white">
                public and business administration.
                </p>
                <div className="fade-in-up delay-700 mt-8 flex flex-wrap gap-4">
                  <NavLink
                    to="/corporate-services"
                    className="inline-flex items-center rounded-md bg-pink-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-600"
                  >
                    Our Services <ArrowRight className="h-4 w-4 ml-4" />
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Contact Us <ArrowRight className="h-4 w-4 ml-4" />
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative w-12 h-3 rounded-full transition-all duration-500 ease-out ${
                    index === currentSlide
                      ? 'bg-white/90 scale-110'
                      : 'bg-white/30 hover:bg-white/60 hover:scale-105'
                  }`}
                >
                  {/* Progress bar for active slide */}
                  {index === currentSlide && (
                    <div 
                      className="absolute inset-0 bg-pink-500 rounded-full transition-all duration-500"
                      style={{
                        animation: 'slideProgress 8000ms linear infinite'
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex flex-col items-center animate-bounce">
                <span className="text-gray-400 text-sm mb-2 font-medium">Scroll Down</span>
                <ChevronDown className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse hidden lg:block"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse hidden lg:block"></div>
          </section>

           {/* Who We Are Section */}
           <section className="py-16 md:py-24 bg-white ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 md:grid-cols-2 md:items-center">
                {/* Image Animation */}
                <div className="fade-in-left">
                  <div className="relative h-[300px] overflow-hidden transition-all  rounded-lg shadow-xl sm:h-[400px]">
                    <img
                      src={im3}
                      alt="Programming code on screen"
                      className="object-cover h-full w-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Text Content Animation */}
                <div className="max-w-xl">
                  <div className="fade-in-up">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                      Who We Are
                    </h2>
                  </div>
                  <div className="fade-in-up delay-200">
                    <p className="mt-6 text-lg leading-relaxed text-gray-600">
                      CSTS is an organization set up to strengthen the capacity of companies and entrepreneurs in core areas such
                      as corporate governance, financial management, public and business administration to ensure that these
                      entities become competitive in their various industries.
                    </p>
                  </div>
                  <div className="fade-in-up delay-400">
                    <p className="mt-6 text-lg leading-relaxed text-gray-600">
                      Our long-established background in corporate learning enables us to design and deliver bespoke learning
                      programmes that blend next-generation learning technologies and techniques in a way that drives performance
                      and inspires a culture of lifelong learning.
                    </p>
                  </div>
                  <div className="fade-in-up delay-600">
                    <div className="mt-8">
                      <NavLink  
                        to="/who-we-are"
                        className="inline-flex items-center text-sm font-medium text-white transition-colors bg-pink-500 h-10 px-4 rounded-md hover:transform-3d"
                      >
                        Learn more about us
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
      </div>
    );
  }