import { Outlet } from "react-router";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <Outlet />
            <Footer />
        </div>
    );
};

export default PublicLayout;