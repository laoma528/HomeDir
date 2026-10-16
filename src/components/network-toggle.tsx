"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Globe, Server } from "lucide-react";

export function NetworkToggle({
  isInternal,
  onToggle,
}: {
  isInternal: boolean;
  onToggle: (isInternal: boolean) => void;
}) {
  const toggle = () => {
    const next = !isInternal;
    toast(next ? "已切换到内网模式" : "已切换到外网模式", {
      icon: next ? <Server className="size-4" /> : <Globe className="size-4" />,
    });
    onToggle(next);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
      title={isInternal ? "切换到外网模式" : "切换到内网模式"}
      aria-label={isInternal ? "切换到外网模式" : "切换到内网模式"}
      onClick={toggle}
    >
      {isInternal ? <Server className="size-3.5" /> : <Globe className="size-3.5" />}
    </Button>
  );
}
