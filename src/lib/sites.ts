import "server-only";
import { getAllSites, getConfig, getAllShortcuts } from "@/lib/db";
import { sortCategories } from "@/lib/categories";
import type { SiteData, ShortcutConfig } from "@/lib/types";
import type { SiteConfig } from "@/lib/db";

export function getSites(): { sites: SiteData[]; categories: string[]; config: SiteConfig; shortcuts: ShortcutConfig[] } {
  const rows = getAllSites();
  const config = getConfig();

  const sites: SiteData[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    desc: r.desc,
    icon: r.icon,
    icon_url: r.icon_url,
    category: r.category,
    url: { internal: r.url_internal, external: r.url_external },
    sort_order: r.sort_order,
    created_at: r.created_at,
  }));

  const categories = sortCategories(
    Array.from(new Set(sites.map((s) => s.category))),
    config.category_order
  );

  // 站点跟随分类顺序，让首页「全部」的排列与分类标签栏一致
  // （SQL 已按 sort_order, name 排好，这里只按分类重排，保持组内次序）
  const rank = new Map(categories.map((name, i) => [name, i]));
  sites.sort((a, b) => (rank.get(a.category) ?? 0) - (rank.get(b.category) ?? 0));

  const shortcuts = getAllShortcuts().map((s) => ({ key: s.key, site_id: s.site_id }));

  return { sites, categories, config, shortcuts };
}
