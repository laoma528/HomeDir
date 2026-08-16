"use client";

import { useState, useCallback, useRef } from "react";
import { updateSponsorsAction, uploadIconAction } from "@/app/admin/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getIconUrl } from "@/lib/icons";
import {
  MAX_SPONSORS,
  parseSponsors,
  type Sponsor,
} from "@/lib/footer-links";
import { isSafeUrl } from "@/lib/social";
import { Plus, Trash2, Loader2, Save, Heart, ArrowUp, ArrowDown, ImagePlus } from "lucide-react";

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** 行内 logo 上传 —— 上传后仅暂存文件名，随「保存赞助商」一起落库 */
function LogoButton({ value, onChange }: { value: string; onChange: (filename: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.ico"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploading(true);
          try {
            const fd = new FormData();
            fd.append("file", file);
            const result = await uploadIconAction(fd);
            if (result.success) onChange(result.data!);
            else toast.error(result.error);
          } finally {
            setUploading(false);
            e.target.value = "";
          }
        }}
      />
      <button
        type="button"
        title="上传 logo"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex h-8 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/30 text-muted-foreground transition-colors hover:bg-accent"
      >
        {uploading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : value ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={getIconUrl(value)} alt="" className="size-full object-contain p-0.5" />
        ) : (
          <ImagePlus className="size-3.5" />
        )}
      </button>
    </>
  );
}

export function AdminSponsors({ value }: { value: string }) {
  const [items, setItems] = useState<Sponsor[]>(() => parseSponsors(value));
  const [draft, setDraft] = useState({ name: "", url: "", logo: "" });
  const [saving, setSaving] = useState(false);

  const handleAdd = useCallback(() => {
    const name = draft.name.trim();
    const url = draft.url.trim();
    if (!draft.logo) { toast.error("请上传 logo"); return; }
    if (!name) { toast.error("请填写赞助商名称"); return; }
    if (!url) { toast.error("请填写地址"); return; }
    if (!isSafeUrl(url)) { toast.error("地址需以 http/https 开头"); return; }
    if (items.length >= MAX_SPONSORS) { toast.error(`最多添加 ${MAX_SPONSORS} 个赞助商`); return; }

    setItems((prev) => [...prev, { id: genId(), name, url, logo: draft.logo }]);
    setDraft({ name: "", url: "", logo: "" });
  }, [draft, items.length]);

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const move = useCallback((index: number, dir: -1 | 1) => {
    setItems((prev) => {
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
      const result = await updateSponsorsAction(items);
      if (!result.success) { toast.error(result.error); return; }
      toast.success("赞助商已保存");
    } finally { setSaving(false); }
  }, [items]);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <Heart className="size-4" />
        赞助商
      </div>
      <p className="mb-4 text-[11px] text-muted-foreground">
        以 logo 图片的形式显示在首页页脚，建议横版透明底 PNG/SVG，单张不超过 2MB，最多 {MAX_SPONSORS} 个。
      </p>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          暂无赞助商
        </div>
      ) : (
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors hover:bg-accent/20"
            >
              <LogoButton
                value={item.logo}
                onChange={(logo) =>
                  setItems((prev) => prev.map((s) => (s.id === item.id ? { ...s, logo } : s)))
                }
              />
              <div className="min-w-0 flex-1">
                <Input
                  value={item.name}
                  onChange={(e) =>
                    setItems((prev) => prev.map((s) => (s.id === item.id ? { ...s, name: e.target.value } : s)))
                  }
                  className="h-7 border-0 bg-transparent px-0 text-xs font-medium shadow-none focus-visible:ring-0"
                />
                <Input
                  value={item.url}
                  onChange={(e) =>
                    setItems((prev) => prev.map((s) => (s.id === item.id ? { ...s, url: e.target.value } : s)))
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
                  disabled={i === items.length - 1}
                >
                  <ArrowDown className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive/60 hover:text-destructive"
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length < MAX_SPONSORS && (
        <div className="mt-4 flex items-center gap-2">
          <LogoButton value={draft.logo} onChange={(logo) => setDraft((p) => ({ ...p, logo }))} />
          <Input
            value={draft.name}
            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            placeholder="名称"
            className="h-8 w-28 shrink-0 text-xs"
          />
          <Input
            value={draft.url}
            onChange={(e) => setDraft((p) => ({ ...p, url: e.target.value }))}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            placeholder="https://example.com"
            className="h-8 min-w-0 flex-1 text-xs"
          />
          <Button
            size="sm"
            className="h-8 shrink-0"
            onClick={handleAdd}
            disabled={!draft.logo || !draft.name.trim() || !draft.url.trim()}
          >
            <Plus className="size-3.5" />
            添加
          </Button>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          保存赞助商
        </Button>
      </div>
    </div>
  );
}
