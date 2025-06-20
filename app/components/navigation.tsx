import { useState } from "react"
import { motion } from "framer-motion"
import { Code2, X, Menu } from "lucide-react"
import { Link, useLocation } from "react-router"

export default function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Who We Are", path: "/who-we-are" },
        { name: "Compliance Notices", path: "/compliance-notices" },
        { name: "Events", path: "/events" },
        { name: "Trainings", path: "/trainings" },
        { name: "Corporate Services", path: "/corporate-services" },
        { name: "Gallery", path: "/gallery" },
        { name: "Directors' Bank", path: "/directors-bank" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" },
    ]

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Link to="/" className="flex items-center">
                        <img className="lg:w-[10vw] lg:h-10 w-[20vw] h-8" src="https://res.cloudinary.com/djlnjjzvt/image/upload/v1746824751/CSTS_Logo_eu8gmg.png" alt="" />
                    </Link>
                </motion.div>

                <motion.nav
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="hidden space-x-6 md:flex"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`text-sm font-medium transition-colors hover:text-pink-500 ${
                                location.pathname === item.path ? "text-pink-500 font-semibold" : "text-gray-700"
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </motion.nav>

                <div className="md:hidden">
                    <button className="text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden"
                >
                    <div className="space-y-1 px-4 pb-4 pt-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                                    location.pathname === item.path
                                        ? "bg-pink-50 text-pink-500 font-semibold"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-pink-500"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </header>
    )
}
