"use client";

import { useCallback, useEffect, useMemo } from "react";
import { getIcon, getIconUrl } from "@/lib/icons";
import type { SiteData } from "@/lib/types";
import { Search } from "lucide-react";
import { getSiteTargetUrl, type OutboundTrackingConfig } from "@/lib/outbound-url";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function SearchDialog({
  sites,
  categories,
  isInternal,
  outboundTracking,
  open,
  onOpenChange,
}: {
  sites: SiteData[];
  categories: string[];
  isInternal: boolean;
  outboundTracking: OutboundTrackingConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const grouped = useMemo(() => {
    const map: Record<string, SiteData[]> = {};
    for (const cat of categories) {
      const items = sites.filter((s) => s.category === cat);
      if (items.length > 0) map[cat] = items;
    }
    return map;
  }, [sites, categories]);

  const handleSelect = useCallback(
    (site: SiteData) => {
      const url = getSiteTargetUrl(site, isInternal, outboundTracking);
      window.open(url, "_blank", "noopener");
      onOpenChange(false);
    },
    [isInternal, outboundTracking, onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="搜索服务…" />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground/60">
            <Search className="size-8 stroke-[1.5]" />
            <span className="text-sm">没有找到相关服务</span>
          </div>
        </CommandEmpty>
        {Object.entries(grouped).map(([cat, items]) => (
          <CommandGroup key={cat} heading={cat}>
            {items.map((site) => {
              const Icon = getIcon(site.icon);
              const url = getSiteTargetUrl(site, isInternal, outboundTracking);
              let hostname: string;
              try { hostname = new URL(url).hostname; } catch { hostname = url; }
              return (
                <CommandItem
                  key={site.id}
                  value={`${site.name} ${site.desc}`}
                  onSelect={() => handleSelect(site)}
                  className="gap-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted/80">
                    {site.icon_url ? (
                      <img src={getIconUrl(site.icon_url)} alt="" className="size-5 rounded-md object-contain" />
                    ) : (
                      <Icon className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{site.name}</div>
                    <div className="truncate text-xs text-muted-foreground/60">{hostname}</div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
