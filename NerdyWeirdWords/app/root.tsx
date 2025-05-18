import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import type {Route} from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
    {
        rel: "apple-touch-icon",
        href: "apple-touch-icon.png",
        sizes: "180x180",
    },
    {
        rel: "icon",
        href: "favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
    },
    {
        rel: "icon",
        href: "favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
    },
    {
        rel: "manifest",
        href: "site.webmanifest",
    },
    {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/cyborg/bootstrap.min.css",
    },
];

export function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <Links/>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
        </head>
        <body>
        {children}
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet/>;
}

fetch("http://localhost:65535/status").then(response => response.text()).then(console.log);

// TODO: Review from here on

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
            )}
        </main>
    );
}

