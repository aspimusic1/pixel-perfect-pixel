import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import "./index.css";

async function clearGetBookedServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ("caches" in window) {
    const cacheKeys = await window.caches.keys();
    await Promise.all(
      cacheKeys
        .filter((key) => key.startsWith("getbooked-"))
        .map((key) => window.caches.delete(key))
    );
  }
}

clearGetBookedServiceWorkers().catch(() => {});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
