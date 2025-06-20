import { Users, Award, Target, Clock, Check, Eye, Users2Icon } from "lucide-react"
import im1 from "~/components/image/csts (74)-1.jpg"
import vision from "~/components/image/vission.avif"
import mission from "~/components/image/mission1.avif"

export default function WhoWeArePage() {
    return (
        <div>
            <main className="flex-1">
                <div className="bg-gray-50 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center fade-in-up delay-700">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Who We Are</h1>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                Learn about our organization, mission, and values
                            </p>
                        </div>
                    </div>
                </div>

                <section className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 md:grid-cols-2 md:items-center">
                            <div className="fade-in-up delay-800">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Story</h2>
                                    <div className="mt-6 space-y-6 text-lg text-gray-600">
                                        <p>
                                            CSTS is an organization set up to strengthen the capacity of companies and entrepreneurs in core areas such as corporate governance, financial management, public and business administration to ensure that these entities become competitive in their various industries.
                                        </p>


                                    </div>
                                </div>
                                <div className="mt-10">
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Expertise</h2>
                                    <div className="mt-6 space-y-6 text-lg text-gray-600">
                                        <p>
                                            Our long-established background in corporate learning enables us to design and deliver bespoke learning programmes that blend next generation learning technologies and techniques in a way that drives performance and inspires a culture of lifelong learning.


                                        </p>
                                        <p>
                                            With expertise in corporate governance, financial management, public administration, and business development, CSTS has established itself as a trusted partner for businesses seeking to enhance their operational effectiveness and compliance.
                                        </p>


                                    </div>
                                </div>
                            </div>

                            <div className="relative h-[300px] overflow-hidden rounded-lg shadow-xl sm:h-[400px] fade-in-up delay-800">
                                <img src={im1} alt="Our team" className="object-cover h-full" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center fade-in-up">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Values</h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                These core principles guide everything we do
                            </p>
                        </div>

                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: <Award className="h-8 w-8 text-pink-500" />,
                                    title: "Excellence",
                                    description: "We strive for excellence in all our services and operations.",
                                },
                                {
                                    icon: <Users className="h-8 w-8 text-pink-500" />,
                                    title: "Integrity",
                                    description: " We uphold the highest ethical standards in all our dealings.",
                                },
                                {
                                    icon: <Target className="h-8 w-8 text-pink-500" />,
                                    title: "Innovation",
                                    description: "We constantly seek innovative solutions to meet client needs",
                                },
                                {
                                    icon: <Clock className="h-8 w-8 text-pink-500" />,
                                    title: "Client Focus",
                                    description: "We prioritize understanding and meeting the unique needs of each client.",
                                },
                                {
                                    icon: <Users2Icon className="h-8 w-8 text-pink-500" />,
                                    title: "Collaboration",
                                    description: "We believe in the power of teamwork and partnerships.",
                                },
                            ].map((value, index) => (
                                <div key={index} className={`rounded-lg hover:transform-3d transition-all border border-gray-200 bg-white px-6 h-60 pt-6 text-center shadow-sm fade-in-up delay-${index * 100 + 200}`}>
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-50">
                                        {value.icon}
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="lg:grid lg:grid-cols-2 gap-20 py-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div>
                            <img src={vision} alt="Our team" className="object-cover h-full rounded-lg" />
                        </div>
                        <div className=" flex flex-col justify-center items-center   transition-all p-10 fade-in-right delay-200">
                            <div className="flex justify-between items-center">
                                <h4 className="text-2xl font-montserrat font-bold">
                                    Vission
                                </h4>
                               
                            </div>
                            <p className="mt-16">
                                "To provide exceptional corporate services and training programs that empower businesses and entrepreneurs to achieve their full potential and succeed in an increasingly competitive business environment.
                            </p>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="lg:grid lg:grid-cols-2 gap-20 py-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className=" flex flex-col justify-center items-center   transition-all p-10 fade-in-left delay-200">
                                <div className="flex justify-between items-center">
                                <h4 className="text-2xl font-montserrat font-bold">
                                    Mission
                                </h4>
                               
                            </div>
                            <p className="mt-16">
                                "To provide exceptional corporate services and training programs that empower businesses and entrepreneurs to achieve their full potential and succeed in an increasingly competitive business environment.
                            </p>
                        </div>
                        <div>
                            <img src={mission} alt="Our team" className="object-cover h-full rounded-lg" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
