import type { SiteData } from "@/lib/types";

export interface OutboundTrackingConfig {
  enabled: boolean;
  source: string;
}

/**
 * 为外网地址追加统一的来源标识。
 *
 * 原始站点地址始终保持不变；已有 UTM 参数不会被覆盖。
 */
export function addOutboundTracking(url: string, config: OutboundTrackingConfig): string {
  const source = config.source.trim();
  if (!config.enabled || !source) return url;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return url;
    if (!parsed.searchParams.has("utm_source")) parsed.searchParams.set("utm_source", source);
    if (!parsed.searchParams.has("utm_medium")) parsed.searchParams.set("utm_medium", "referral");
    return parsed.toString();
  } catch {
    return url;
  }
}

/** 根据当前网络模式选择地址，仅当最终选中外网地址时追加 UTM。 */
export function getSiteTargetUrl(
  site: SiteData,
  isInternal: boolean,
  tracking: OutboundTrackingConfig
): string {
  const internalUrl = site.url.internal.trim();
  const externalUrl = site.url.external.trim();
  const usesExternalUrl = isInternal ? !internalUrl && !!externalUrl : !!externalUrl;
  const target = isInternal
    ? internalUrl || externalUrl
    : externalUrl || internalUrl;

  return usesExternalUrl ? addOutboundTracking(target, tracking) : target;
}
