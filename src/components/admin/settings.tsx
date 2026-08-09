"use client";

import { useState, useCallback, useRef } from "react";
import { updateConfigAction, uploadIconAction } from "@/app/dash/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminSocial } from "@/components/admin/social";
import { getIconUrl } from "@/lib/icons";
import { Loader2, Save, Upload, X, Terminal } from "lucide-react";

/** logo / favicon 上传字段 — 上传后仅暂存文件名，随「保存配置」一起落库 */
function ImageField({
  id, label, hint, value, fallback, onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  fallback: React.ReactNode;
  onChange: (filename: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border text-muted-foreground">
          {value ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={getIconUrl(value)} alt="" className="size-full object-contain" />
          ) : (
            fallback
          )}
        </div>
        <input
          ref={inputRef}
          id={id}
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
              if (result.success) {
                onChange(result.data!);
                toast.success("上传成功，请点击保存配置");
              } else {
                toast.error(result.error);
              }
            } finally {
              setUploading(false);
              e.target.value = "";
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
          选择图片
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} title="恢复默认">
            <X className="size-3.5" />
            移除
          </Button>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

export function AdminSettings({ config }: { config: { site_name: string; site_description: string; footer_text: string; auto_detect_network: string; social_links: string; site_logo: string; site_icon: string } }) {
  const [form, setForm] = useState({
    site_name: config.site_name,
    site_description: config.site_description,
    footer_text: config.footer_text,
    auto_detect_network: config.auto_detect_network,
    site_logo: config.site_logo,
    site_icon: config.site_icon,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!form.site_name.trim()) { toast.error("站点名称不能为空"); return; }
    if (!form.site_description.trim()) { toast.error("站点描述不能为空"); return; }
    setSaving(true);
    try {
      const result = await updateConfigAction({
        site_name: form.site_name,
        site_description: form.site_description,
        footer_text: form.footer_text,
        site_logo: form.site_logo,
        site_icon: form.site_icon,
      });
      if (!result.success) { toast.error(result.error); return; }
      toast.success("配置已保存");
    } finally { setSaving(false); }
  }, [form]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4 text-sm font-medium">基本设置</div>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="cfg_name">站点名称</Label>
            <Input
              id="cfg_name"
              value={form.site_name}
              onChange={(e) => setForm((p) => ({ ...p, site_name: e.target.value }))}
              required
            />
            <p className="text-[11px] text-muted-foreground">页面标题</p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cfg_desc">站点描述</Label>
            <Input
              id="cfg_desc"
              value={form.site_description}
              onChange={(e) => setForm((p) => ({ ...p, site_description: e.target.value }))}
              required
            />
            <p className="text-[11px] text-muted-foreground">SEO描述</p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cfg_footer">页脚文字</Label>
            <Input
              id="cfg_footer"
              value={form.footer_text}
              onChange={(e) => setForm((p) => ({ ...p, footer_text: e.target.value }))}
            />
            <p className="text-[11px] text-muted-foreground">支持 HTML，留空则不显示</p>
          </div>
          <ImageField
            id="cfg_logo"
            label="站点 Logo"
            hint="显示在首页标题左侧，建议正方形 PNG/SVG，不超过 2MB，留空则用默认图标"
            value={form.site_logo}
            fallback={<Terminal className="size-4" />}
            onChange={(v) => setForm((p) => ({ ...p, site_logo: v }))}
          />
          <ImageField
            id="cfg_icon"
            label="浏览器图标"
            hint="显示在浏览器标签页，建议 32×32 或 favicon.ico，留空则用默认图标"
            value={form.site_icon}
            fallback={<span className="text-[10px]">ico</span>}
            onChange={(v) => setForm((p) => ({ ...p, site_icon: v }))}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            保存配置
          </Button>
        </div>
      </div>

      <AdminSocial value={config.social_links} />

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4 text-sm font-medium">功能配置</div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Label>自动探测网络</Label>
              <p className="text-[11px] text-muted-foreground">自动检测内外网并切换访问地址</p>
            </div>
            <Switch
              checked={form.auto_detect_network === "true"}
              onCheckedChange={async (v) => {
                const val = v ? "true" : "false";
                setForm((p) => ({ ...p, auto_detect_network: val }));
                const result = await updateConfigAction({ auto_detect_network: val });
                if (result.success) toast.success(v ? "已开启自动探测" : "已关闭自动探测");
                else toast.error(result.error);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
