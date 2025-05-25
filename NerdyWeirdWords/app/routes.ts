import {
    type RouteConfig,
    index,
    route,
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("signin/:jsonWebToken?", "user/signIn.tsx"),
] satisfies RouteConfig;

