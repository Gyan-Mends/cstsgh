import { useState } from "react"
import { CheckCircle, Building, FileText, Users, Calendar, ArrowRight } from "lucide-react"
import { Link } from "react-router"
import service from "~/components/image/sec.jpg"

export default function CorporateServicesPage() {
    const [activeTab, setActiveTab] = useState("RGD")

    return (
        <div>
            <main className="flex min-h-screen flex-col bg-white">
                {/* Hero Section */}
                <section className=" py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center fade-in-up delay-200">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                                Corporate Services
                            </h1>
                            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
                                We offer a comprehensive range of corporate services designed to support businesses at every stage of their development.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Company Secretarial Services Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 fade-in-right delay-100">Company Secretarial Services</h2>

                        <div className="mt-12 lg:flex gap-12 ">
                            {/* Image Section */}
                            <div className="relative h-80 overflow-hidden rounded-lg shadow-lg fade-in-right delay-200">
                                <img
                                    src={service}
                                    alt="Code on computer screen"
                                    className=" h-full w-[100vw] object-cover"
                                />
                            </div>

                            {/* Text Content */}
                            <div className="fade-in-left delay-300">
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Our Company's Secretarial Services is intended to help companies, institutions and other business entities meet their standard statutory compliance needs, assist clients to manage and mitigate risks of corporate non-compliance and innovative and support you (clients) with your administrative burdens.
                                </p>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    {[{
                                        icon: <CheckCircle />, text: "Board Management"
                                    },
                                    { icon: <CheckCircle />, text: "Provision of Corporate Documents" },
                                    { icon: <CheckCircle />, text: "Allotment and Transfer of Shares Register" },
                                    { icon: <CheckCircle />, text: "Meeting Packs and Minute Taking" },
                                    {
                                        icon: <CheckCircle />, text: "Annual Meeting of Shareholders -including proxy statement",
                                    },
                                    { icon: <CheckCircle />, text: "Statutory Compliance Services" },
                                    { icon: <CheckCircle />, text: "Maintaining Company Registers" },
                                    {
                                        icon: <CheckCircle />,
                                        text: "Maintaining and Retaining Corporate / Statutory Records",
                                    },
                                    { icon: <CheckCircle />, text: "Shareholders, Board and Committee Meeting" },
                                    ].map((item, index) => (
                                        <div key={index} className={`flex items-start fade-in-up delay-${index * 100 + 400}`}>
                                            <div className="mr-3  text-pink-500">{item.icon}</div>
                                            <p className="text-gray-800">{item.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 fade-in-up delay-800">
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center rounded-md  bg-pink-500 px-6 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-pink-600"
                                    >
                                        Request Service <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statutory Registrations Section */}
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="fade-in-up">
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Statutory Registrations</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                CSTS understands the stress associated with legitimate business registration and procedures, therefore
                                our company offers to minimize the stress of individuals, companies, and institutions by rendering
                                services of ORC, GIPC, GRA, on their behalf.
                            </p>
                        </div>

                        <div className="mt-12">
                            <div className="mb-6 flex rounded-lg border border-gray-200 bg-white fade-in-up delay-200">
                                {["ORC", "GRA", "GIPC"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === tab
                                            ? "border-b-2 border-pink-500 text-pink-500"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {activeTab === "ORC" && (
                                <div className="rounded-lg border border-gray-200 bg-white p-8 fade-in-up delay-300">
                                    <h3 className="mb-6 text-xl font-bold text-gray-900">Registrar Generals' Department (RGD)</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {[
                                            "Company Registration/Incorporation",
                                            "Business Name Registration",
                                            "Filing of Annual Returns",
                                            "Amendment of Company Regulations",
                                            "Increase in Stated Capital",
                                            "Change of Company Name",
                                            "Change of Company Directors",
                                        ].map((service, index) => (
                                            <div key={index} className={`flex items-start fade-in-left delay-${index * 100 + 400}`}>
                                                <CheckCircle className="mr-3 mt-1 h-5 w-5 text-pink-500" />
                                                <p className="text-gray-700">{service}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "GRA" && (
                                <div className="rounded-lg border border-gray-200 bg-white p-8 fade-in-up delay-300">
                                    <h3 className="mb-6 text-xl font-bold text-gray-900">Ghana Revenue Authority (GRA)</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {[
                                            "Tax Identification Number (TIN) Registration",
                                            "Tax Clearance Certificate",
                                            "Tax Filing and Compliance",
                                            "Tax Advisory Services",
                                        ].map((service, index) => (
                                            <div key={index} className={`flex items-start fade-in-left delay-${index * 100 + 400}`}>
                                                <CheckCircle className="mr-3 mt-1 h-5 w-5 text-pink-500" />
                                                <p className="text-gray-700">{service}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "GIPC" && (
                                <div className="rounded-lg border border-gray-200 bg-white p-8 fade-in-up delay-300">
                                    <h3 className="mb-6 text-xl font-bold text-gray-900">Ghana Investment Promotion Centre (GIPC)</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {[
                                            "GIPC Registration for Foreign Investors",
                                            "Investment Advisory Services",
                                            "Sector-specific Investment Guidance",
                                            "Regulatory Compliance for Foreign Investments",
                                            "Investment Certificate Applications",
                                            "Annual GIPC Renewals",
                                        ].map((service, index) => (
                                            <div key={index} className={`flex items-start fade-in-left delay-${index * 100 + 400}`}>
                                                <CheckCircle className="mr-3 mt-1 h-5 w-5 text-pink-500" />
                                                <p className="text-gray-700">{service}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-8 text-center fade-in-up delay-600">
                            <Link
                                to="/contact"
                                className="inline-flex items-center rounded-md bg-pink-500 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-pink-600"
                            >
                                Request Registration Service <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Service Boxes Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="fade-in-up">
                            <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">Our Additional Services</h2>
                        </div>

                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    title: "Provision of Board Toolkit",
                                    description:
                                        "We provide a pack of Company Secretarial Logistics for various entities, ensuring your board has all the necessary tools and resources for effective governance.",
                                    link: "#learn-more",
                                    delay: 0.1,
                                },
                                {
                                    title: "Virtual Office",
                                    description:
                                        "Our virtual office services allow clients to work from anywhere using a variety of internet-based business operations. We'll assist you in establishing and maintaining a presence in a coveted area.",
                                    link: "#learn-more",
                                    delay: 0.2,
                                },
                                {
                                    title: "Registered Box",
                                    description:
                                        "CSTS services assist firms and business entities in obtaining a legal address so that they can receive official documents that are critical to their operations.",
                                    link: "#learn-more",
                                    delay: 0.3,
                                },
                                {
                                    title: "Process Server",
                                    description:
                                        "We act as a process agent for our clients who may require this service especially for clients who desire to register External Companies in Ghana.",
                                    link: "#learn-more",
                                    delay: 0.4,
                                },
                                {
                                    title: "Consultancy Services",
                                    description:
                                        "At CSTS, we take pride in having top professional experts who provide expert guidance in areas such as management, corporate governance, business law, and many more specialized subjects.",
                                    link: "#learn-more",
                                    delay: 0.5,
                                },
                            ].map((service, index) => (
                                <div key={index} className={`h-full rounded-lg lg:h-[40vh] border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between fade-in-up delay-${index * 100 + 100}`}>
                                    <div>
                                        <h3 className="mb-4 text-xl font-bold text-gray-900">{service.title}</h3>
                                        <p className="text-gray-600">{service.description}</p>
                                    </div>
                                    <div className="mt-6">
                                        <Link
                                            to={service.link}
                                            className="inline-flex items-center rounded-md bg-pink-500 px-4 py-2 text-sm font-medium justify-center w-full text-white shadow-sm transition-colors hover:bg-pink-600"
                                        >
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            </div>
    )
}
