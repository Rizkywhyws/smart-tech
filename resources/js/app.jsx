import { configureEcho } from "@laravel/echo-react";

configureEcho({
    broadcaster: "reverb",
});
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import LoginSuccessModal from "./Components/LoginSuccessModal";

const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });

createInertiaApp({
    title: (title) => title || "SmartTech",
    progress: false, 
    resolve: (name) => {
        const page = pages[`./Pages/${name}.jsx`];
        if (!page) throw new Error(`Halaman Inertia tidak ditemukan: ${name}`);
        return page.default;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <App {...props} />
                <LoginSuccessModal />
            </>,
        );
    },
});    
