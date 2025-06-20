import { Twitter, Instagram, Facebook, Linkedin, MapPin, Phone, Mail, Youtube, X } from "lucide-react"
import { NavLink } from "react-router"

export default function Footer() {
    return (
        <footer className="bg-white">
                {/* Main Footer Content */}
                <div className="py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                            {/* About CSTS */}
                            <div className="lg:col-span-2">
                                <div className="mb-6">
                                    <img 
                                        src="https://res.cloudinary.com/djlnjjzvt/image/upload/v1746824751/CSTS_Logo_eu8gmg.png" 
                                        alt="CSTS" 
                                        className="h-12 w-auto" 
                                    />
                                </div>
                                <p className=" leading-relaxed mb-6 max-w-md">
                                    Corporate Secretarial and Training Services Limited strengthens the capacity of companies and entrepreneurs in corporate governance, financial management, and business administration.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="https://web.facebook.com/cstsghana/about" 
                                       className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                        <Facebook className="w-5 h-5 text-white" />
                                    </a>
                                    <a href="https://x.com/cstsgh" 
                                       className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                        <X className="w-5 h-5 text-white" />
                                    </a>
                                    <a href="https://www.instagram.com/cstsghana" 
                                       className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                                        <Instagram className="w-5 h-5 text-white" />
                                    </a>
                                    <a href="https://www.linkedin.com/in/csts-ghana-398975174/" 
                                       className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                                        <Linkedin className="w-5 h-5 text-white" />
                                    </a>
                                    <a href="https://www.youtube.com/@cstsghana6166" 
                                       className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                                        <Youtube className="w-5 h-5 text-white" />
                                    </a>
                                </div>
                            </div>

                            {/* Our Services */}
                            <div>
                                <h4 className="text-lg font-semibold mb-6 ">Our Services</h4>
                                <ul className="space-y-3">
                                    <li><NavLink to="/corporate-services" >Company Secretarial Services</NavLink></li>
                                    <li><NavLink to="/corporate-services" >Statutory Registrations</NavLink></li>
                                    <li><NavLink to="/corporate-services" >Corporate Training</NavLink></li>
                                    <li><NavLink to="/Trainings" >Entrepreneurship Training</NavLink></li>
                                    <li><NavLink to="/corporate-services" >Virtual Office Services</NavLink></li>
                                    <li><NavLink to="/corporate-services" >Consultancy Services</NavLink></li>
                                </ul>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="text-lg font-semibold mb-6 ">Quick Links</h4>
                                <ul className="space-y-3">
                                    <li><NavLink to="/" >Home</NavLink></li>
                                    <li><NavLink to="/Who-We-Are" >Who We Are</NavLink></li>
                                    <li><NavLink to="/corporate-services" >Corporate Services</NavLink></li>
                                    <li><NavLink to="/Trainings" >Training Programs</NavLink></li>
                                    <li><NavLink to="/Events" >Events</NavLink></li>
                                    <li><NavLink to="/Blog" >Blog</NavLink></li>
                                    <li><NavLink to="/contact" >Contact Us</NavLink></li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mt-12 pt-8 border-t ">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div>
                                    <h4 className="text-lg font-semibold mb-4 ">Contact Information</h4>
                                    <div className="space-y-3 ">
                                        <p className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5  flex-shrink-0" />
                                            <span>15 Netflix Street UPSA Road, Madina, Accra</span>
                                        </p>
                                        <p className="flex items-center gap-3">
                                            <Mail className="w-5 h-5  flex-shrink-0" />
                                            <div className="flex flex-col">
                                                <a href="mailto:info@cstsghana.com" className="hover: transition-colors">
                                                    info@cstsghana.com
                                                </a>
                                                <a href="mailto:ghanacsts@gmail.com" className="hover: transition-colors">
                                                    ghanacsts@gmail.com
                                                </a>
                                            </div>
                                        </p>
                                        <p className="flex items-center gap-3">
                                            <Phone className="w-5 h-5  flex-shrink-0" />
                                            <div className="flex flex-col">
                                                <a href="tel:+233201108331" className="hover: transition-colors">
                                                    +233 20 110 8331
                                                </a>
                                                <a href="tel:+233270308880" className="hover: transition-colors">
                                                    +233 27 030 8880
                                                </a>
                                                <a href="tel:+233506326541" className="hover: transition-colors">
                                                    +233 50 632 6541
                                                </a>
                                            </div>
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-4 ">Get Started</h4>
                                    <p className=" text-sm mb-4">
                                        Ready to strengthen your business capacity and ensure compliance? Let us help you achieve corporate excellence.
                                    </p>
                                   
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-4 ">Our Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-gray-200  px-3 py-1 rounded-full text-xs">Corporate Governance</span>
                                        <span className="bg-gray-200  px-3 py-1 rounded-full text-xs">Financial Management</span>
                                        <span className="bg-gray-200  px-3 py-1 rounded-full text-xs">Business Registration</span>
                                        <span className="bg-gray-200  px-3 py-1 rounded-full text-xs">Compliance</span>
                                        <span className="bg-gray-200  px-3 py-1 rounded-full text-xs">Training & Development</span>
                                        <span className="bg-gray-200  px-3 py-1 rounded-full text-xs">Entrepreneurship</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="mt-8 pt-6 border-t ">
                            <div className="text-center">
                                <h4 className="text-lg font-semibold mb-2 ">Business Hours</h4>
                                <p className=" text-sm">
                                    Monday - Friday: 9:00 AM - 5:00 PM | Saturday & Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className=" py-6">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-gray-400 text-sm">
                                © 2024 Corporate Secretarial and Training Services Limited (CSTS). All rights reserved.
                            </div>
                            <div className="flex gap-6 text-sm">
                                <NavLink to="/privacy-policy" className="text-gray-400 hover: transition-colors">Privacy Policy</NavLink>
                                <NavLink to="/terms-of-service" className="text-gray-400 hover: transition-colors">Terms of Service</NavLink>
                                <NavLink to="/compliance" className="text-gray-400 hover: transition-colors">Compliance Standards</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
    )
}
