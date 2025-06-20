import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_publicLayout.tsx", [
    route("/", "routes/home/index.tsx"),
    route("/who-we-are", "routes/who-we-are/index.tsx"),
    route("/compliance-notices", "routes/compliance-notices/index.tsx"),
    route("/events", "routes/events/index.tsx"),
    route("/events/:id", "routes/events/$id.tsx"),
    route("/trainings", "routes/trainings/index.tsx"),
    route("/trainings/:typesId", "routes/trainings/$typesId.tsx"),
    route("/trainings/:typesId/:id", "routes/trainings/$typesId.$id.tsx"),
    route("/corporate-services", "routes/corporate-services/index.tsx"),
    route("/gallery", "routes/gallery/index.tsx"),
    route("/directors-bank", "routes/directors-bank/index.tsx"),
    route("/blog", "routes/blog/index.tsx"),
    route("/blog/:id", "routes/blog/$id.tsx"),
    route("/contact", "routes/contact/index.tsx"),
  ]),

  route("/login", "routes/login.tsx"),

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
    route("/dashboard/settings", "routes/dashboard/settings.tsx"),
  ]),

  // API Routes
  route("/api/auth", "routes/api/auth.ts"),
  route("/api/users", "routes/api/users.ts"),
  route("/api/categories", "routes/api/categories.ts"),
  route("/api/blogs", "routes/api/blogs.ts"),
  route("/api/training", "routes/api/training.ts"),
  route("/api/training-types", "routes/api/training-types.ts"),
  route("/api/events", "routes/api/events.ts"),
  route("/api/notices", "routes/api/notices.ts"),
  route("/api/contact", "routes/api/contact.ts"),
  route("/api/gallery", "routes/api/gallery.ts"),
  route("/api/directors-bank", "routes/api/directors-bank.ts"),
] satisfies RouteConfig;
