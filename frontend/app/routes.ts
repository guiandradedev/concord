import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/_public/home.tsx"),

    layout("routes/_public/_auth/layout.tsx", [
        route('login', 'routes/_public/_auth/login.tsx'),
        route('signup', 'routes/_public/_auth/signup.tsx'),
    ]),

    layout("routes/_private/layout.tsx", [
        route('app', 'routes/_private/app.tsx'),
        route('profile', 'routes/_private/profile.tsx'),

        // route('chat', 'routes/_private/app.tsx'), // Temporariamente renderiza /app
        route('chat/:userId', 'routes/_private/chat.tsx'),
    ]),
] satisfies RouteConfig;
