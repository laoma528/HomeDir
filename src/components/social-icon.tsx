import { getIcon } from "@/lib/icons";
import { getPlatform } from "@/lib/social";

/** 按平台渲染图标：品牌图标走 fill path，通用图标走 lucide */
export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const p = getPlatform(platform);

  if (p?.path) {
    // 光学缩放：外扩 viewBox 让字形按比例收缩，居中不变
    const scale = p.scale ?? 1;
    const pad = (24 / scale - 24) / 2;
    return (
      <svg
        className={className}
        viewBox={`${-pad} ${-pad} ${24 / scale} ${24 / scale}`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={p.path} />
      </svg>
    );
  }

  const Icon = getIcon(p?.lucide || "Link");
  return <Icon className={className} aria-hidden="true" />;
}
