import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { niveaux } from "@/lib/niveaux";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{ path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "a-propos", priority: 0.7, changeFrequency: "monthly" },
    { path: "methode-egyptienne", priority: 0.9, changeFrequency: "monthly" },
    { path: "programme", priority: 0.9, changeFrequency: "monthly" },
    { path: "tarifs", priority: 0.9, changeFrequency: "monthly" },
    { path: "test-de-niveau", priority: 0.8, changeFrequency: "monthly" },
    { path: "inscription", priority: 0.8, changeFrequency: "monthly" },
    { path: "contact", priority: 0.6, changeFrequency: "yearly" },
  ];

  const niveauRoutes = niveaux.map((n) => ({
    path: `programme/${n.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...niveauRoutes].map((r) => ({
    url: `${site.url}${r.path ? `/${r.path}` : ""}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
