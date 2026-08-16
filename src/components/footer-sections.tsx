import { getIconUrl } from "@/lib/icons";
import { parseFriendLinks, parseSponsors } from "@/lib/footer-links";

/** 页脚友情链接 + 赞助商 — Server Component，0 JS */
export function FooterSections({ friendLinks, sponsors }: { friendLinks: string; sponsors: string }) {
  const links = parseFriendLinks(friendLinks);
  const items = parseSponsors(sponsors);
  if (links.length === 0 && items.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {links.length > 0 && (
        <section className="flex flex-col items-center gap-2">
          <h2 className="text-[11px] font-medium tracking-wide text-muted-foreground/50">友情链接</h2>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.desc || link.name}
                className="text-[11px] text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </section>
      )}

      {items.length > 0 && (
        <section className="flex flex-col items-center gap-2">
          <h2 className="text-[11px] font-medium tracking-wide text-muted-foreground/50">赞助商</h2>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                title={item.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getIconUrl(item.logo)}
                  alt={item.name}
                  className="h-6 w-auto max-w-28 object-contain opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
