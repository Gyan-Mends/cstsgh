export const meta = () => {
    return [
        { title: "Dashboard - CSTS Admin" },
        { name: "description", content: "Dashboard" },
        { name: "keywords", content: "Dashboard, Admin, Dashboard Admin csts admin dashboard csts admin dashboard" },
        { name: "robots", content: "index, follow" },
        { name: "author", content: "CSTS" },
        { rel: "canonical", href: "https://csts.com" },
        { property: "og:title", content: "Dashboard" },
        { property: "og:description", content: "Dashboard" },
        { property: "og:url", content: "https://csts.com" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en_US" },
        { property: "og:site_name", content: "CSTS" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Dashboard" },
        { name: "twitter:description", content: "Dashboard" },
        { name: "twitter:image", content: "https://csts.com/og-image.png" },
        { rel: "icon", href: "/favicon.ico" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
    ];
};



const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
};

export default Dashboard;