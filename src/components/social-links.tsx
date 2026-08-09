import { SocialIcon } from "@/components/social-icon";
import { getSocialLabel, parseSocialLinks } from "@/lib/social";

/** 页头社交名片 — Server Component，0 JS */
export function SocialLinks({ value }: { value: string }) {
  const links = parseSocialLinks(value);
  if (links.length === 0) return null;

  return (
    <nav className="flex items-center gap-3">
      {links.map((link) => {
        const label = getSocialLabel(link);
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            aria-label={label}
            className="text-muted-foreground/50 transition-colors hover:text-muted-foreground"
          >
            <SocialIcon platform={link.platform} className="size-4" />
          </a>
        );
      })}
    </nav>
  );
}
