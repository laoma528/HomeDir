import { getIcon } from "@/lib/icons";
import { getPlatform } from "@/lib/social";

/** 按平台渲染图标：品牌图标走 fill path，通用图标走 lucide */
export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const p = getPlatform(platform);

  if (p?.path) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={p.path} />
      </svg>
    );
  }

  const Icon = getIcon(p?.lucide || "Link");
  return <Icon className={className} aria-hidden="true" />;
}
