import type {Route} from "./+types/home";
import {Welcome} from "~/welcome/welcome";

export function meta({}: Route.MetaArgs) {
    return [
        {name: "author", content: "Fabio Scagliola"},
        {name: "description", content: "A web app for writers to share their work with beta readers, gather feedback, and engage with them."},
        {name: "keywords", content: ""},
        {title: "/nerdy|weird|words/"},
    ];
}

export default function Home() {
    return <Welcome/>;
}

