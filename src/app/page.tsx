import { Terminal } from "lucide-react";
import Script from "next/script";
import { getSites } from "@/lib/sites";
import { getIconUrl } from "@/lib/icons";
import { HomePage } from "@/components/home-page";
import { SocialLinks } from "@/components/social-links";
import { FooterSections } from "@/components/footer-sections";

export const dynamic = "force-dynamic";

// GA4 测量 ID 格式校验（本项目约束：G- 后跟字母数字，总长 ≤64）
const GA_ID_RE = /^G-[A-Z0-9]+$/;
function isValidGaId(id: string): boolean {
  return GA_ID_RE.test(id) && id.length <= 64;
}

export default async function Page() {
  const { sites, categories, config, shortcuts } = getSites();
  const gaId = isValidGaId(config.ga_measurement_id) ? config.ga_measurement_id : null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pt-8 sm:px-6 lg:px-8">
      {/* Google Analytics — 仅统计首页，ID 无效时不注入 */}
      {gaId && (
        <>
          <Script
            id="ga-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
      {/* 标题 — Server Component，0 JS */}
      <header className="mb-8 flex items-center gap-2.5">
        {config.site_logo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={getIconUrl(config.site_logo)} alt="" className="size-5 shrink-0 rounded object-contain" />
        ) : (
          <Terminal className="size-5 shrink-0" />
        )}
        <h1 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">{config.site_name}</h1>
        <SocialLinks value={config.social_links} />
      </header>

      {/* 交互区域 — Client Component */}
      <div className="flex-1">
        <HomePage
          sites={sites}
          categories={categories}
          shortcuts={shortcuts}
          autoDetectNetwork={config.auto_detect_network === "true"}
          outboundTracking={{
            enabled: config.outbound_utm_enabled === "true",
            source: config.outbound_utm_source,
          }}
        />
      </div>

      {/* 底部 */}
      <footer className="mt-auto flex flex-col items-center gap-4 pb-4 pt-8">
        <FooterSections friendLinks={config.friend_links} sponsors={config.sponsors} />
        {config.footer_text && (
          <p className="text-[11px] text-muted-foreground/60 [&_a]:no-underline [&_a]:hover:text-muted-foreground" dangerouslySetInnerHTML={{ __html: config.footer_text }} />
        )}
      </footer>
    </div>
  );
}
