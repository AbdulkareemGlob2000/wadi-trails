import { regions, trails, type Region, type Trail } from "@/data/catalogue";

export function listRegions(): Region[] {
  return regions;
}

export function getRegion(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}

export function listTrails(regionSlug: string): Trail[] {
  return trails.filter((t) => t.regionSlug === regionSlug);
}

export function getTrail(id: string): Trail | undefined {
  return trails.find((t) => t.id === id);
}

export function listAllTrails(): Trail[] {
  return trails;
}
