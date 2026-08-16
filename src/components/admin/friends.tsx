"use client";

import { useState, useCallback } from "react";
import { updateFriendLinksAction } from "@/app/admin/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MAX_FRIEND_LINKS,
  parseFriendLinks,
  type FriendLink,
} from "@/lib/footer-links";
import { isSafeUrl } from "@/lib/social";
import { Plus, Trash2, Loader2, Save, Link2, ArrowUp, ArrowDown } from "lucide-react";

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function AdminFriends({ value }: { value: string }) {
  const [links, setLinks] = useState<FriendLink[]>(() => parseFriendLinks(value));
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = useCallback(() => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName) { toast.error("请填写站点名称"); return; }
    if (!trimmedUrl) { toast.error("请填写地址"); return; }
    if (!isSafeUrl(trimmedUrl)) { toast.error("地址需以 http/https 开头"); return; }
    if (links.length >= MAX_FRIEND_LINKS) { toast.error(`最多添加 ${MAX_FRIEND_LINKS} 个友链`); return; }

    setLinks((prev) => [...prev, { id: genId(), name: trimmedName, url: trimmedUrl }]);
    setName("");
    setUrl("");
  }, [name, url, links.length]);

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
      const result = await updateFriendLinksAction(links);
      if (!result.success) { toast.error(result.error); return; }
      toast.success("友情链接已保存");
    } finally { setSaving(false); }
  }, [links]);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <Link2 className="size-4" />
        友情链接
      </div>
      <p className="mb-4 text-[11px] text-muted-foreground">
        以文字链接的形式显示在首页页脚，留空则不显示，最多 {MAX_FRIEND_LINKS} 个。
      </p>

      {links.length === 0 ? (
        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          暂无友情链接
        </div>
      ) : (
        <div className="space-y-1.5">
          {links.map((link, i) => (
            <div
              key={link.id}
              className="group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors hover:bg-accent/20"
            >
              <div className="min-w-0 flex-1">
                <Input
                  value={link.name}
                  onChange={(e) =>
                    setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, name: e.target.value } : l)))
                  }
                  className="h-7 border-0 bg-transparent px-0 text-xs font-medium shadow-none focus-visible:ring-0"
                />
                <Input
                  value={link.url}
                  onChange={(e) =>
                    setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)))
                  }
                  className="h-7 border-0 bg-transparent px-0 text-[11px] text-muted-foreground shadow-none focus-visible:ring-0"
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

      {links.length < MAX_FRIEND_LINKS && (
        <div className="mt-4 flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            placeholder="站点名称"
            className="h-8 w-32 shrink-0 text-xs"
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            placeholder="https://example.com"
            className="h-8 min-w-0 flex-1 text-xs"
          />
          <Button size="sm" className="h-8 shrink-0" onClick={handleAdd} disabled={!name.trim() || !url.trim()}>
            <Plus className="size-3.5" />
            添加
          </Button>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          保存友链
        </Button>
      </div>
    </div>
  );
}
