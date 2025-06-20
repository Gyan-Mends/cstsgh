import { Button } from "@heroui/react"
import { ArrowRight, Calendar, BookOpen, Briefcase, FileText, Users, Building, Phone, User, ChevronDown } from "lucide-react"
import hero1 from "~/components/image/hero1.jpg"
import hero2 from "~/components/image/hero2.jpg"
import hero3 from "~/components/image/hero3.jpg"
import im2 from "~/components/image/photo-1487058792275-0ad4aaf24ca7_qqlo0v.avif"
import im3 from "~/components/image/lawyer.jpg"
import boardOld from "~/components/image/board-old-timber-surface-floor_1203-4394.avif"
import { useState, useEffect } from "react"
import { NavLink } from "react-router"


export default function Home() {
  // Background slideshow state
  const [currentSlide, setCurrentSlide] = useState(0)

  // Background images array
  const backgroundImages = [
    hero1,
    hero2,
    hero3,
  ]

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
    }, 8000) // Change slide every 8 seconds for smoother experience

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <div>
      <div className="flex min-h-screen flex-col ">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background Slideshow */}
            <div className="absolute inset-0">
              {backgroundImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-[2500ms] ease-in-out transform ${index === currentSlide
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
                  className={`relative w-12 h-3 rounded-full transition-all duration-500 ease-out ${index === currentSlide
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

          {/* Services Section */}
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center fade-in-up">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Our Services</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                  We provide a wide range of corporate services to help your business thrive in today's competitive environment.
                </p>
              </div>

              <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: "📝",
                    title: "Company Secretarial Services",
                    description:
                      "Help companies meet their statutory compliance needs, assist with managing risks of corporate non-compliance and support with administrative tasks.",
                  },
                  {
                    icon: "⚖️",
                    title: "Statutory Registrations",
                    description:
                      "Minimize the stress of business registration by rendering services of RGD, GIPC, and GRA on behalf of individuals, companies, and institutions.",
                  },
                  {
                    icon: "👩‍🏫",
                    title: "Corporate Training",
                    description:
                      "Bespoke learning programs that blend next-generation learning technologies and techniques to drive performance and inspire a culture of lifelong learning.",
                  },
                  {
                    icon: "💼",
                    title: "Entrepreneurship Training",
                    description:
                      "Exceptional training in entrepreneurship and skill development for individuals and companies, equipping them with requisite skills.",
                  },
                  {
                    icon: "🏢",
                    title: "Virtual Office",
                    description:
                      "Virtual office services allowing clients to work from anywhere using a variety of internet-based business operations.",
                  },
                  {
                    icon: "📊",
                    title: "Consultancy Services",
                    description: "Ensuring your business meets all regulatory requirements and industry standards.",
                  },
                ].map((service, index) => (
                  <div className={`fade-in-up delay-${index * 100} service-card`} key={index}>
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:shadow-lg hover:transform-3d lg:h-[35vh]">
                      <div className="mb-4 text-4xl">{service.icon}</div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                      <div className="mt-4">
                        <NavLink
                          to="/corporate-services"
                          className="inline-flex items-center text-sm font-medium text-pink-500 transition-colors hover:text-pink-600"
                        >
                          Learn more
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </NavLink>
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            </div>
            <div className="flex justify-center items-center mt-20 fade-in-up delay-600">
              <NavLink
                to="/corporate-services"
                className="inline-flex items-center rounded-md h-10 px-6 py-3 text-sm font-medium text-white transition-colors  hover:transform-3d bg-pink-500"
              >
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </NavLink>
            </div>
          </section>

          {/* Event Programs Section */}
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="mx-auto max-w-7xl  sm:px-6 lg:px-8">
              <div className="text-center fade-in-up">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Upcoming Event</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                  Join us for our upcoming events and workshops to enhance your knowledge and skills.
                </p>
              </div>

              <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: <Calendar className="text-pink-500" />,
                    Status: "Upcoming",
                    title: "Business Support Center Launch",
                    date: "June 15, 2025",
                    description:
                      "Join us for the grand opening of our new Business Support Center, designed to provide resources and guidance to entrepreneurs and small business owners.",
                  },
                  {
                    icon: <Calendar className="text-pink-500" />,
                    Status: "Upcoming",
                    title: "Corporate Governance Workshop",
                    date: "July 10, 2025",
                    description:
                      "A comprehensive workshop on corporate governance best practices under the new Companies Act of Ghana, tailored for executives and board members.",
                  },
                  {
                    icon: <Calendar className="text-pink-500" />,
                    Status: "Upcoming",
                    title: "Entrepreneurship Training Series",
                    date: "August 5-12, 2025",
                    description:
                      "A week-long training series focused on equipping entrepreneurs with essential skills in various areas including product development, marketing, and financial management.",
                  },
                ].map((program, index) => (
                  <div className={`slide-in-right delay-${index * 100} event-card`} key={index}>
                    <div className="rounded-lg border hover:transform-3d border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                      <div className="flex justify-between mb-4">
                        <div className="bg-pink-200 p-1 rounded bounce-in delay-200">{program.icon}</div>
                        <div className="py-1 px-4 bg-gray-50 rounded-full fade-in delay-300">{program.Status}</div>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">{program.title}</h3>
                      <p className="mb-4 text-sm font-medium text-gray-500">{program.date}</p>
                      <p className="text-gray-600">{program.description}</p>

                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center fade-in-up delay-300">
                <NavLink
                  to="/Events"
                  className="inline-flex items-center text-sm font-medium text-pink-500 transition-colors hover:text-pink-600"
                >
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </NavLink>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          {/* <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center fade-in-down">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">What Our Clients Say</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                  Don't just take our word for it. Here's what our clients have to say about our services.
                </p>
              </div>

              <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    quote:
                      "CSTS provided exceptional corporate secretarial services that helped us navigate complex regulatory requirements with ease.",
                    author: "Michael Asante",
                    position: "CEO, Global Ventures Ltd",
                  },
                  {
                    quote:
                      "The entrepreneurship training program was transformative for my business. I gained practical skills that I immediately applied to grow my operations.",
                    author: "Akosua Mensah",
                    position: "Founder, Eco Solutions Ghana",
                  },
                  {
                    quote:
                      "Their virtual office solution has been a game-changer for our international business operations in Ghana.",
                    author: "James Wilson",
                    position: "Director, UK-Ghana Trade Initiative",
                  },
                ].map((testimonial, index) => (
                  <div className={`zoom-in delay-${index * 200} testimonial-card`} key={index}>
                    <div className="rounded-lg hover:transform-3d transition-all border border-gray-200 h-[35vh] bg-white p-6 shadow-sm">
                      <div className="mb-2">
                        <p><User className="text-pink-500 bounce-in delay-100" /></p>
                      </div>
                      <p className="text-gray-600">"{testimonial.quote}"</p>
                      <div className="mt-6">
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section> */}

          {/* CTA Section */}
          <section
            className="relative py-16 md:py-24 overflow-hidden"
            style={{
              backgroundImage: `url(${boardOld})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Pattern Overlay for texture */}
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 md:grid-cols-2 md:items-center">
                <div className="slide-in-left">
                  <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Ready to Elevate Your Business?
                  </h2>
                  <p className="mt-4 text-lg text-white/90">
                    Whether you need corporate secretarial services, business registration, or professional training, our team of experts is ready to support your business needs.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <NavLink
                      to="/contact"
                      className="inline-flex items-center rounded-md shadow-lg bg-white px-6 py-3 text-sm font-medium text-pink-600 transition-all hover:bg-gray-50 hover:shadow-xl hover:transform-3d"
                    >
                      Get in Touch
                      <ArrowRight className="h-4 w-4 ml-4" />
                    </NavLink>
                    <NavLink
                      to="/corporate-services"
                      className="inline-flex items-center rounded-md shadow-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/20 hover:border-white/50 hover:shadow-xl"
                    >
                      Explore Services
                      <ArrowRight className="h-4 w-4 ml-4" />
                    </NavLink>
                  </div>
                </div>

                <div className="slide-in-right delay-200">
                  <div className="relative h-[300px] transition-all overflow-hidden rounded-lg sm:h-[400px] hover:transform-3d">
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 p-8 rounded-lg">
                      <div className="text-center">
                        <Phone className="mx-auto h-12 w-12 text-pink-500 bounce-in delay-100" />
                        <p className="mt-4 text-xl font-bold text-gray-900 fade-in-up delay-200">Contact Us</p>
                        <p className="mt-2 text-gray-700 fade-in-up delay-300">0201108331 / 0270308880 / 0506326541</p>
                        <p className="text-gray-700 fade-in-up delay-400">info@cstsghana.com</p>
                        <p className="mt-4 text-sm text-gray-600 fade-in-up delay-500">Monday - Friday: 9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

