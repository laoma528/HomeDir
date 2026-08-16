"use client";

import { useState, useCallback } from "react";
import { updateSocialLinksAction } from "@/app/admin/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialIcon } from "@/components/social-icon";
import {
  MAX_SOCIAL_LINKS,
  SOCIAL_PLATFORMS,
  getPlatform,
  isSafeUrl,
  parseSocialLinks,
  type SocialLink,
} from "@/lib/social";
import { Plus, Trash2, Loader2, Save, Contact, ArrowUp, ArrowDown } from "lucide-react";

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function AdminSocial({ value }: { value: string }) {
  const [links, setLinks] = useState<SocialLink[]>(() => parseSocialLinks(value));
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const selected = getPlatform(platform);

  const handleAdd = useCallback(() => {
    if (!platform) { toast.error("请选择平台"); return; }
    const trimmed = url.trim();
    if (!trimmed) { toast.error("请填写地址"); return; }
    if (!isSafeUrl(trimmed)) { toast.error("地址需以 http/https/mailto 开头"); return; }
    if (links.length >= MAX_SOCIAL_LINKS) { toast.error(`最多添加 ${MAX_SOCIAL_LINKS} 个链接`); return; }

    setLinks((prev) => [...prev, { id: genId(), platform, url: trimmed }]);
    setPlatform("");
    setUrl("");
  }, [platform, url, links.length]);

  const handleRemove = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const move = useCallback((index: number, dir: -1 | 1) => {
    setLinks((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const result = await updateSocialLinksAction(links);
      if (!result.success) { toast.error(result.error); return; }
      toast.success("社交名片已保存");
    } finally { setSaving(false); }
  }, [links]);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <Contact className="size-4" />
        社交名片
      </div>
      <p className="mb-4 text-[11px] text-muted-foreground">
        显示在首页右上角，可放 GitHub、TG 群、X 等。留空则不显示，最多 {MAX_SOCIAL_LINKS} 个。
      </p>

      {links.length === 0 ? (
        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          暂无社交链接
        </div>
      ) : (
        <div className="space-y-1.5">
          {links.map((link, i) => (
            <div
              key={link.id}
              className="group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors hover:bg-accent/20"
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <SocialIcon platform={link.platform} className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium">{getPlatform(link.platform)?.label}</div>
                <Input
                  value={link.url}
                  onChange={(e) =>
                    setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)))
                  }
                  className="mt-1 h-7 border-0 bg-transparent px-0 text-[11px] text-muted-foreground shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex shrink-0 items-center sm:opacity-0 sm:group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                >
                  <ArrowUp className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  onClick={() => move(i, 1)}
                  disabled={i === links.length - 1}
                >
                  <ArrowDown className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive/60 hover:text-destructive"
                  onClick={() => handleRemove(link.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {links.length < MAX_SOCIAL_LINKS && (
        <div className="mt-4 flex items-center gap-2">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="h-8 w-32 shrink-0 text-xs">
              <SelectValue placeholder="选择平台" />
            </SelectTrigger>
            <SelectContent>
              {SOCIAL_PLATFORMS.map((p) => (
                <SelectItem key={p.key} value={p.key} className="text-xs">
                  <span className="flex items-center gap-2">
                    <SocialIcon platform={p.key} className="size-3.5" />
                    {p.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            placeholder={selected?.placeholder || "https://example.com"}
            className="h-8 min-w-0 flex-1 text-xs"
          />
          <Button size="sm" className="h-8 shrink-0" onClick={handleAdd} disabled={!platform || !url.trim()}>
            <Plus className="size-3.5" />
            添加
          </Button>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          保存名片
        </Button>
      </div>
    </div>
  );
}
