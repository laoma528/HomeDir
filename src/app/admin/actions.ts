"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import {
  createSite,
  updateSite,
  deleteSite,
  renameCategory,
  deleteCategory,
  getConfig,
  updateConfig,
  createShortcut,
  deleteShortcut,
  getAllShortcuts,
} from "@/lib/db";
import type { SiteConfig } from "@/lib/db";
import { saveIcon } from "@/lib/icons-fs";
import {
  MAX_SOCIAL_LINKS,
  getPlatform,
  isSafeUrl,
  serializeSocialLinks,
  type SocialLink,
} from "@/lib/social";
import {
  MAX_FRIEND_LINKS,
  MAX_SPONSORS,
  isIconFilename,
  serializeFriendLinks,
  serializeSponsors,
  type FriendLink,
  type Sponsor,
} from "@/lib/footer-links";
import {
  renameInCategoryOrder,
  removeFromCategoryOrder,
  serializeCategoryOrder,
} from "@/lib/categories";

interface SiteFormInput {
  name: string;
  desc: string;
  icon: string;
  icon_url?: string;
  category: string;
  url_internal: string;
  url_external: string;
  sort_order: number;
}

type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };

function validate(data: SiteFormInput): string | null {
  if (!data.name || data.name.trim().length === 0) return "名称不能为空";
  if (data.name.length > 100) return "名称不能超过 100 个字符";
  if (!data.category || data.category.trim().length === 0) return "分类不能为空";
  if (!data.url_internal && !data.url_external) return "至少填写一个地址";
  return null;
}

async function requireAuth<T = void>(): Promise<ActionResult<T> | null> {
  if (!(await isAuthenticated())) return { success: false, error: "未登录" };
  return null;
}

export async function createSiteAction(formData: SiteFormInput): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  const error = validate(formData);
  if (error) return { success: false, error };

  try {
    createSite(formData);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("创建站点失败:", e);
    return { success: false, error: "创建站点失败" };
  }
}

export async function updateSiteAction(id: string, formData: SiteFormInput): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  if (!id) return { success: false, error: "站点 ID 不能为空" };

  const error = validate(formData);
  if (error) return { success: false, error };

  try {
    const result = updateSite(id, formData);
    if (!result) return { success: false, error: "站点不存在" };
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("更新站点失败:", e);
    return { success: false, error: "更新站点失败" };
  }
}

export async function deleteSiteAction(id: string): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  if (!id) return { success: false, error: "站点 ID 不能为空" };

  try {
    const ok = deleteSite(id);
    if (!ok) return { success: false, error: "站点不存在" };
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("删除站点失败:", e);
    return { success: false, error: "删除站点失败" };
  }
}

// 分类操作
export async function renameCategoryAction(oldName: string, newName: string): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  if (!oldName || !newName.trim()) return { success: false, error: "分类名称不能为空" };
  if (oldName === newName) return { success: true };

  try {
    const trimmed = newName.trim();
    renameCategory(oldName, trimmed);
    updateConfig({
      category_order: renameInCategoryOrder(getConfig().category_order, oldName, trimmed),
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("重命名分类失败:", e);
    return { success: false, error: "重命名分类失败" };
  }
}

export async function deleteCategoryAction(name: string): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  if (!name) return { success: false, error: "分类名称不能为空" };

  try {
    deleteCategory(name);
    updateConfig({
      category_order: removeFromCategoryOrder(getConfig().category_order, name),
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("删除分类失败:", e);
    return { success: false, error: "删除分类失败" };
  }
}

export async function updateCategoryOrderAction(order: string[]): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  if (!Array.isArray(order)) return { success: false, error: "排序数据格式错误" };

  try {
    const cleaned = order
      .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
      .map((name) => name.trim());
    updateConfig({ category_order: serializeCategoryOrder(cleaned) });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("保存分类顺序失败:", e);
    return { success: false, error: "保存分类顺序失败" };
  }
}

// 抓取 favicon 并保存到本地文件
export async function fetchFaviconAction(url: string): Promise<ActionResult<string>> {
  const authErr = await requireAuth<string>();
  if (authErr) return authErr;
  try {
    const { origin, hostname, protocol } = new URL(url);
    const tryFetch = async (u: string): Promise<Buffer | null> => {
      try {
        const res = await fetch(u, { signal: AbortSignal.timeout(5000), redirect: "follow" });
        if (!res.ok) return null;
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("image") && !ct.includes("icon") && !ct.includes("octet-stream")) return null;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 10) return null;
        return buf;
      } catch { return null; }
    };

    let iconBuf: Buffer | null = null;

    // 1) 从 HTML 解析 <link rel="icon"> href
    try {
      const html = await fetch(origin, { signal: AbortSignal.timeout(5000), redirect: "follow" }).then(r => r.text());
      const m = html.match(/<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["']/i)
        || html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*icon[^"']*["']/i);
      if (m) {
        let href = m[1];
        if (href.startsWith("//")) href = `${protocol}${href}`;
        else if (href.startsWith("/")) href = `${origin}${href}`;
        else if (!href.startsWith("http")) href = `${origin}/${href}`;
        iconBuf = await tryFetch(href);
      }
    } catch {}

    // 2) 常见路径
    if (!iconBuf) {
      for (const p of ["/favicon.ico", "/apple-touch-icon.png"]) {
        iconBuf = await tryFetch(`${origin}${p}`);
        if (iconBuf) break;
      }
    }

    // 3) Google API 兜底（外网）
    if (!iconBuf && !/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|localhost|127\.)/.test(hostname)) {
      iconBuf = await tryFetch(`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`);
    }

    if (!iconBuf) return { success: false, error: "未找到图标" };

    // 保存到 data/icons/
    const filename = saveIcon(iconBuf);
    return { success: true, data: filename };
  } catch {
    return { success: false, error: "URL 格式无效" };
  }
}

// 上传图标
export async function uploadIconAction(formData: FormData): Promise<ActionResult<string>> {
  const authErr = await requireAuth<string>();
  if (authErr) return authErr;
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { success: false, error: "请选择文件" };
  if (file.size > 2 * 1024 * 1024) return { success: false, error: "文件不能超过 2MB" };
  if (!/^image\//.test(file.type) && !file.name.endsWith(".ico")) return { success: false, error: "仅支持图片文件" };
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const filename = saveIcon(buf);
    return { success: true, data: filename };
  } catch {
    return { success: false, error: "上传失败" };
  }
}

// 热键操作
export async function createShortcutAction(key: string, siteId: string): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  if (!key.trim() || key.trim().length !== 1) return { success: false, error: "热键必须是单个字母" };
  if (!/^[a-zA-Z0-9]$/.test(key.trim())) return { success: false, error: "热键必须是字母或数字" };
  if (key.trim().toUpperCase() === "K") return { success: false, error: "⌘K 为内置搜索热键，不可使用" };
  if (!siteId) return { success: false, error: "请选择站点" };
  // 检查重复
  if (getAllShortcuts().some((s) => s.key.toUpperCase() === key.trim().toUpperCase())) return { success: false, error: "该热键已被占用" };
  try {
    createShortcut(key.trim(), siteId);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("创建热键失败:", e);
    return { success: false, error: "创建热键失败" };
  }
}

export async function deleteShortcutAction(id: string): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  if (!id) return { success: false, error: "ID 不能为空" };
  try {
    deleteShortcut(id);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("删除热键失败:", e);
    return { success: false, error: "删除热键失败" };
  }
}

// 社交名片操作
export async function updateSocialLinksAction(links: SocialLink[]): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  if (!Array.isArray(links)) return { success: false, error: "数据格式错误" };
  if (links.length > MAX_SOCIAL_LINKS) return { success: false, error: `最多添加 ${MAX_SOCIAL_LINKS} 个链接` };

  const cleaned: SocialLink[] = [];
  for (const link of links) {
    if (!getPlatform(link.platform)) return { success: false, error: "不支持的平台" };
    const url = (link.url || "").trim();
    if (!url) return { success: false, error: "地址不能为空" };
    if (!isSafeUrl(url)) return { success: false, error: "地址需以 http/https/mailto 开头" };
    if (url.length > 500) return { success: false, error: "地址过长" };
    const label = (link.label || "").trim();
    if (label.length > 30) return { success: false, error: "备注不能超过 30 个字符" };
    cleaned.push({ id: link.id, platform: link.platform, url, label: label || undefined });
  }

  try {
    updateConfig({ social_links: serializeSocialLinks(cleaned) });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("保存社交名片失败:", e);
    return { success: false, error: "保存社交名片失败" };
  }
}

// 页脚友情链接
export async function updateFriendLinksAction(links: FriendLink[]): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  if (!Array.isArray(links)) return { success: false, error: "数据格式错误" };
  if (links.length > MAX_FRIEND_LINKS) return { success: false, error: `最多添加 ${MAX_FRIEND_LINKS} 个友链` };

  const cleaned: FriendLink[] = [];
  for (const link of links) {
    const name = (link.name || "").trim();
    if (!name) return { success: false, error: "站点名称不能为空" };
    if (name.length > 50) return { success: false, error: "站点名称不能超过 50 个字符" };
    const url = (link.url || "").trim();
    if (!url) return { success: false, error: "地址不能为空" };
    if (!isSafeUrl(url)) return { success: false, error: "地址需以 http/https 开头" };
    if (url.length > 500) return { success: false, error: "地址过长" };
    const desc = (link.desc || "").trim();
    if (desc.length > 50) return { success: false, error: "描述不能超过 50 个字符" };
    cleaned.push({ id: link.id, name, url, desc: desc || undefined });
  }

  try {
    updateConfig({ friend_links: serializeFriendLinks(cleaned) });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("保存友情链接失败:", e);
    return { success: false, error: "保存友情链接失败" };
  }
}

// 页脚赞助商
export async function updateSponsorsAction(items: Sponsor[]): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  if (!Array.isArray(items)) return { success: false, error: "数据格式错误" };
  if (items.length > MAX_SPONSORS) return { success: false, error: `最多添加 ${MAX_SPONSORS} 个赞助商` };

  const cleaned: Sponsor[] = [];
  for (const item of items) {
    const name = (item.name || "").trim();
    if (!name) return { success: false, error: "赞助商名称不能为空" };
    if (name.length > 50) return { success: false, error: "赞助商名称不能超过 50 个字符" };
    const url = (item.url || "").trim();
    if (!url) return { success: false, error: "地址不能为空" };
    if (!isSafeUrl(url)) return { success: false, error: "地址需以 http/https 开头" };
    if (url.length > 500) return { success: false, error: "地址过长" };
    const logo = (item.logo || "").trim();
    if (!logo) return { success: false, error: `请为「${name}」上传 logo` };
    if (!isIconFilename(logo)) return { success: false, error: "logo 文件名不合法" };
    cleaned.push({ id: item.id, name, url, logo });
  }

  try {
    updateConfig({ sponsors: serializeSponsors(cleaned) });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("保存赞助商失败:", e);
    return { success: false, error: "保存赞助商失败" };
  }
}

// 配置操作
export async function updateConfigAction(config: Partial<SiteConfig>): Promise<ActionResult> {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  if (config.site_name !== undefined && !config.site_name.trim()) return { success: false, error: "站点名称不能为空" };
  if (config.site_description !== undefined && !config.site_description.trim()) return { success: false, error: "站点描述不能为空" };
  try {
    updateConfig(config);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("保存配置失败:", e);
    return { success: false, error: "保存配置失败" };
  }
}
