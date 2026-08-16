/**
 * 页脚板块：友情链接 + 赞助商
 *
 * 两者都存在 config 表里（friend_links / sponsors 键，JSON 数组字符串），
 * 解析一律防御式 —— 脏数据丢弃而不抛错，避免坏配置把首页整页打崩。
 */

import { isSafeUrl } from "@/lib/social";

export interface FriendLink {
  id: string;
  name: string;
  url: string;
  /** 悬浮提示，留空则不显示 */
  desc?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  url: string;
  /** logo 图片 —— data/icons/ 下的文件名，同站点 Logo 的存储 */
  logo: string;
}

export const MAX_FRIEND_LINKS = 30;
export const MAX_SPONSORS = 12;

/** 上传后的图标文件名形如 a1b2c3d4e5f6.png，只允许裸文件名 */
export function isIconFilename(name: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(name) && !name.includes("..");
}

function parseArray(json: string): Record<string, unknown>[] {
  if (!json) return [];
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];
  return raw.filter((it): it is Record<string, unknown> => !!it && typeof it === "object");
}

export function parseFriendLinks(json: string): FriendLink[] {
  return parseArray(json)
    .map((it) => ({
      id: typeof it.id === "string" ? it.id : "",
      name: typeof it.name === "string" ? it.name.trim() : "",
      url: typeof it.url === "string" ? it.url.trim() : "",
      desc: typeof it.desc === "string" ? it.desc : undefined,
    }))
    .filter((it) => it.id && it.name && it.url && isSafeUrl(it.url))
    .slice(0, MAX_FRIEND_LINKS);
}

export function serializeFriendLinks(links: FriendLink[]): string {
  return JSON.stringify(
    links.map((l) => ({
      id: l.id,
      name: l.name,
      url: l.url,
      ...(l.desc ? { desc: l.desc } : {}),
    }))
  );
}

export function parseSponsors(json: string): Sponsor[] {
  return parseArray(json)
    .map((it) => ({
      id: typeof it.id === "string" ? it.id : "",
      name: typeof it.name === "string" ? it.name.trim() : "",
      url: typeof it.url === "string" ? it.url.trim() : "",
      logo: typeof it.logo === "string" ? it.logo.trim() : "",
    }))
    .filter((it) => it.id && it.name && it.url && isSafeUrl(it.url) && it.logo && isIconFilename(it.logo))
    .slice(0, MAX_SPONSORS);
}

export function serializeSponsors(items: Sponsor[]): string {
  return JSON.stringify(
    items.map((s) => ({ id: s.id, name: s.name, url: s.url, logo: s.logo }))
  );
}
