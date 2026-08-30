import { Terminal } from "lucide-react";
import { getSites } from "@/lib/sites";
import { getIconUrl } from "@/lib/icons";
import { HomePage } from "@/components/home-page";
import { SocialLinks } from "@/components/social-links";
import { FooterSections } from "@/components/footer-sections";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { sites, categories, config, shortcuts } = getSites();

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pt-8 sm:px-6 lg:px-8">
      {/* 标题与简介 — Server Component，0 JS；正文语义也供搜索引擎理解首页 */}
      <header className="mb-8 flex items-start gap-2.5">
        {config.site_logo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={getIconUrl(config.site_logo)} alt="" className="mt-0.5 size-5 shrink-0 rounded object-contain" />
        ) : (
          <Terminal className="mt-0.5 size-5 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold tracking-tight">{config.site_name}</h1>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {config.site_description}
          </p>
        </div>
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
