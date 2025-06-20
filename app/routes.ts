import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_publicLayout.tsx", [
    route("/", "routes/home/index.tsx"),
  ]),

  layout("routes/_dashboardLayout.tsx", [
    route("/dashboard", "routes/dashboard/index.tsx"),
    route("/dashboard/users", "routes/dashboard/users.tsx"),
    route("/dashboard/categories", "routes/dashboard/categories.tsx"),
    route("/dashboard/blogs", "routes/dashboard/blogs.tsx"),
    route("/dashboard/training", "routes/dashboard/training.tsx"),
    route("/dashboard/training-types", "routes/dashboard/training-types.tsx"),
    route("/dashboard/events", "routes/dashboard/events.tsx"),
    route("/dashboard/notices", "routes/dashboard/notices.tsx"),
    route("/dashboard/contact", "routes/dashboard/contact.tsx"),
    route("/dashboard/gallery", "routes/dashboard/gallery.tsx"),
    route("/dashboard/directors-bank", "routes/dashboard/directors-bank.tsx"),
  ]),
] satisfies RouteConfig;
