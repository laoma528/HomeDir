---
version: "1.0"
name: HomeDir-design-system
description: >
  HomeDir 是私有服务导航页，采用终端工具美学——Geist Mono 是唯一字体，覆盖所有界面
  表面（标题、时钟、按钮、脚注，无一例外）。色彩体系以绿青色相（OKLCH hue ≈ 155/173.6）
  为主，通过明度和色度的分层承载所有语义角色；destructive 红色是允许的语义例外。
  设计扁平化（near-zero shadow），大圆角（1rem 基值 = 16px），主题切换带有签名性对角线
  clip-path 擦除动画。

colors:
  background: "oklch(0.985 0.002 155)"
  foreground: "oklch(0.175 0.014 155)"
  card: "oklch(0.995 0.001 155)"
  card-foreground: "oklch(0.175 0.014 155)"
  primary: "oklch(0.540 0.100 173.6)"
  primary-foreground: "oklch(0.985 0.002 155)"
  secondary: "oklch(0.945 0.024 155)"
  secondary-foreground: "oklch(0.275 0.038 155)"
  muted: "oklch(0.945 0.015 155)"
  muted-foreground: "oklch(0.505 0.028 155)"
  accent: "oklch(0.935 0.030 155)"
  accent-foreground: "oklch(0.275 0.038 155)"
  border: "oklch(0.905 0.018 155)"
  input: "oklch(0.905 0.018 155)"
  ring: "oklch(0.540 0.100 173.6)"
  destructive: "oklch(0.583 0.239 28.48)"
  dark-background: "oklch(0.155 0.012 155)"
  dark-foreground: "oklch(0.935 0.010 155)"
  dark-card: "oklch(0.195 0.016 155)"
  dark-primary: "oklch(0.809 0.154 173.6)"
  dark-primary-foreground: "oklch(0.155 0.012 155)"
  dark-secondary: "oklch(0.235 0.022 155)"
  dark-secondary-foreground: "oklch(0.905 0.010 155)"
  dark-muted: "oklch(0.235 0.018 155)"
  dark-muted-foreground: "oklch(0.630 0.030 155)"
  dark-accent: "oklch(0.285 0.028 155)"
  dark-border: "oklch(0.295 0.022 155)"
  dark-input: "oklch(0.355 0.028 155)"
  dark-destructive: "oklch(0.702 0.189 22.23)"

typography:
  site-name:
    fontFamily: "Geist Mono"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.30
    letterSpacing: "-0.025em"
  display-admin:
    fontFamily: "Geist Mono"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.30
    note: "仅管理面板用（about 页品牌名、overview 统计数字），首页无此级别"
  stat-number:
    fontFamily: "Geist Mono"
    fontSize: "20–24px"
    fontWeight: 600
    lineHeight: 1.25
    note: "管理面板统计卡片数字，sm: text-2xl"
  body-md:
    fontFamily: "Geist Mono"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.50
  body-sm:
    fontFamily: "Geist Mono"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.50
  body-xs:
    fontFamily: "Geist Mono"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.40
  label-micro:
    fontFamily: "Geist Mono"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.40
  footer-micro:
    fontFamily: "Geist Mono"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.40

rounded:
  sm: "12px"
  md: "14px"
  lg: "16px"
  xl: "20px"
  2xl: "28.8px"
  3xl: "35.2px"
  4xl: "41.6px"
  full: "9999px"

spacing:
  1: "4px"
  2: "8px"
  2.5: "10px"
  3: "12px"
  4: "16px"
  6: "24px"
  8: "32px"
  24: "96px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
    border: "1px solid {colors.border}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-icon:
    backgroundColor: "transparent"
    rounded: "{rounded.lg}"
    size: "32px"
  button-icon-sm:
    backgroundColor: "transparent"
    rounded: "{rounded.md}"
    size: "28px"
  button-icon-xs:
    backgroundColor: "transparent"
    rounded: "{rounded.md}"
    size: "24px"
  site-card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    padding: "12px"
    border: "1px solid {colors.border}"
    shadow: "var(--shadow-sm)"
  site-card-hover:
    backgroundColor: "{colors.accent}/50"
    border: "1px solid {colors.foreground}/15"
    shadow: "var(--shadow-md)"
  site-icon-container:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.lg}"
    size: "32px"
  site-icon-container-lg:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.xl}"
    size: "40px"
  category-tab-bar:
    backgroundColor: "{colors.muted}/40"
    rounded: "{rounded.2xl}"
    padding: "4px"
    border: "1px solid {colors.border}"
  category-tab:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-xs}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  category-tab-active:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  category-tab-indicator:
    backgroundColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    transition: "300ms cubic-bezier(0.25, 1, 0.5, 1)"
  toolbar-group:
    backgroundColor: "{colors.muted}/40"
    rounded: "{rounded.xl}"
    padding: "4px"
    border: "1px solid {colors.border}"
  toolbar-divider:
    backgroundColor: "{colors.border}"
    width: "1px"
    height: "16px"
  badge-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.4xl}"
    height: "20px"
    padding: "0 8px"
    typography: "{typography.body-xs}"
  badge-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.4xl}"
    height: "20px"
    padding: "0 8px"
    typography: "{typography.body-xs}"
  badge-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.4xl}"
    height: "20px"
    padding: "0 8px"
    typography: "{typography.body-xs}"
  badge-destructive:
    backgroundColor: "{colors.destructive}/10"
    textColor: "{colors.destructive}"
    rounded: "{rounded.4xl}"
    height: "20px"
    padding: "0 8px"
    typography: "{typography.body-xs}"
  empty-state:
    backgroundColor: "transparent"
    rounded: "{rounded.2xl}"
    border: "1px dashed {colors.border}"
    padding: "96px 0"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  shortcut-overlay:
    backgroundColor: "{colors.card}/80"
    rounded: "{rounded.3xl}"
    padding: "40px"
    border: "1px solid {colors.border}"
    shadow: "var(--shadow-xl)"
    backdropBlur: "sm"
  shortcut-overlay-backdrop:
    backgroundColor: "transparent"
    backdropBlur: "xl"
    backdropSaturate: "150%"
  shortcut-key:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
    shadow: "var(--shadow-sm)"
    height: "32px"
    minWidth: "32px"
    typography: "{typography.body-xs}"
  search-dialog-icon-container:
    backgroundColor: "{colors.muted}/80"
    rounded: "{rounded.md}"
    size: "36px"
  footer-section-heading:
    textColor: "{colors.muted-foreground}/50"
    typography: "{typography.footer-micro}"
    fontWeight: 500
    letterSpacing: "0.05em"
  footer-friend-link:
    textColor: "{colors.muted-foreground}/60"
    typography: "{typography.footer-micro}"
  footer-sponsor-logo:
    height: "24px"
    maxWidth: "112px"
    opacity: "0.5"
    filter: "grayscale(1)"
  social-link:
    textColor: "{colors.muted-foreground}/50"
    size: "16px"
  header:
    marginBottom: "32px"
    gap: "10px"
  header-logo:
    size: "20px"
    rounded: "4px"
---

## 概览

HomeDir 携带强烈的终端工具美学——整个界面仅使用一种字体 Geist Mono，无论是站点标题、
实时时钟、分类标签还是脚注均如此。这与大多数产品将展示字体与正文字体分离的惯例截然
不同。色彩体系完全锚定于单一色相族（OKLCH hue ≈ 155/173.6，绿青方向），通过明度和
色度的分层承载所有语义角色；destructive 红色（hue 28）是允许的语义例外，不用于装饰。

页面结构极为紧凑：无大图 hero 区、无营销横幅，直接从标题行（logo + 站点名 + 社交链接）
进入工具栏行（时钟 / 搜索 / 内外网切换 / 主题切换），再进入分类标签栏和站点卡片网格。
最大宽度 max-w-5xl（1024px），配合 px-4/6/8 响应式边距，内容密度适中。

站点卡片采用扁平设计：默认 shadow-sm（极微弱阴影）+ 卡片白色背景 + 圆角 xl（20px），
hover 时边框变为 foreground/15（极淡前景色），背景切换为 accent/50，阴影升至 shadow-md，
营造轻盈浮起感而非重投影。分类标签使用带动画滑动指示器的胶囊容器，容器背景为 muted/40。

主题切换是签名性视觉时刻：切换到深色时，一块对角斜面从左下向右上擦入；切换到浅色时，
斜面从右上向左下收拢。动画时长 1s，`cubic-bezier(0.16, 1, 0.3, 1)`（快起缓落），
由 CSS View Transitions API 驱动，`clip-path: polygon(...)` 实现斜切边界。

**核心特征：**
- Geist Mono 等宽字体覆盖所有表面，终端美学一致
- 单色相 OKLCH 色彩体系（hue 155/173.6），浅/深双模式共享同一色相家族
- 扁平化设计（`--shadow-opacity: 0` 默认），大圆角（1rem 基值 = 16px）
- 动画滑块式分类标签 + 半透明 `muted/40` 容器背景
- 对角线 clip-path 主题切换动画（签名视觉时刻）
- 紧凑页面结构（无 hero），直接进入内容网格
- 2 列 → 3 列响应式站点卡片网格
- `muted-foreground/50`、`muted-foreground/60` 多层透明度打造轻量页脚层次

## 颜色

> 所有 token 基于 OKLCH 色彩空间（感知均匀）。浅色/深色双模式通过 `.dark` 类切换，
> 共享同一色相家族——深色模式下 primary 升高 L 并增大 C 以维持对比度。

### 主色

- **Primary 浅色** (`{colors.primary}`, `oklch(0.540 0.100 173.6)`)：中明度、中饱和青绿，
  用于默认按钮、焦点环（ring）、活跃状态指示。
- **Primary 深色** (`{colors.dark-primary}`, `oklch(0.809 0.154 173.6)`)：高明度、高饱和亮青绿，
  在深色背景上保持醒目对比。

### 背景 & 表面层级（浅色）

- **Background** (`{colors.background}`)：近白色，极低色度，页面底色。
- **Card** (`{colors.card}`)：接近纯白，站点卡片背景，略比 background 亮。
- **Secondary / Muted** (`{colors.secondary}` / `{colors.muted}`)：浅灰绿，分类标签栏底色、
  站点图标容器背景、工具栏容器底色（通常搭配 `/40` 透明度使用）。
- **Accent** (`{colors.accent}`)：比 muted 略有色度，卡片 hover 背景（`accent/50`）。

### 背景 & 表面层级（深色）

- **Dark Background** (`{colors.dark-background}`)：极深绿黑，页面底色。
- **Dark Card** (`{colors.dark-card}`)：比背景略亮，卡片背景。
- **Dark Secondary / Muted** (`{colors.dark-secondary}` / `{colors.dark-muted}`)：深灰绿，功能同浅色。

### 文字层级

- **Foreground** (`{colors.foreground}`)：近黑偏绿，主要文字。
- **Muted Foreground** (`{colors.muted-foreground}`)：中灰绿，次要文字（站点描述、时钟、工具图标）。
- **Muted Foreground /50**：社交链接图标静态色，`text-muted-foreground/50`。
- **Muted Foreground /60**：友情链接文字、页脚版权，信息降级的第三层。
- **Muted Foreground /40**：快捷键覆盖层的 "Shortcuts" 标题，最弱的第四层。
- **Dark Foreground** (`{colors.dark-foreground}`)：近白偏绿，深色模式主要文字。

### 边框 & 输入

- **Border** (`{colors.border}`)：浅灰绿，1px 分隔线、卡片边框、输入框边框。
- **Hover border** (`{colors.foreground}/15`)：卡片 hover 时的轻描边——仅 15% 透明度，
  存在但不喧宾夺主。

### 语义色

- **Destructive** (`{colors.destructive}`)：暖红（hue 28.48）——品牌绿青之外唯一被允许的第二色相，
  专属于错误、删除等破坏性语义，不用于任何装饰目的。深色模式下提高明度以增强对比。
- **Ring** (`{colors.ring}`)：与 primary 相同，焦点轮廓（50% 透明度）。

## 字体排版

### 字体族

**Geist Mono**（唯一字体）：等宽几何无衬线。`--font-sans`、`--font-serif`、`--font-mono`
全部指向 Geist Mono，无例外。等宽字体赋予整个界面代码编辑器/终端质感。回退：`monospace`。

> 首页无大标题区，最大常见文字约 14–16px。管理面板在统计数字（`text-xl`/`text-2xl`）
> 和品牌名（`text-2xl font-bold`）处允许使用更大字号。

### 字号层级

| Token | 尺寸 | 字重 | 行高 | 用途 |
|---|---|---|---|---|
| `{typography.display-admin}` | 24px | 700 | 1.30 | 管理面板品牌名（`about`） |
| `{typography.stat-number}` | 20–24px | 600 | 1.25 | 管理面板统计卡片数字 |
| `{typography.site-name}` | 14px | 600 | 1.30 | header 站点名称（`tracking-tight`） |
| `{typography.body-md}` | 16px | 400 | 1.50 | 管理面板正文、输入框 |
| `{typography.body-sm}` | 14px | 400–500 | 1.50 | 按钮、搜索结果标题、桌面端卡片标题 |
| `{typography.body-xs}` | 12px | 500 | 1.40 | 分类标签、时钟、移动端卡片标题 |
| `{typography.label-micro}` | 10px | 400 | 1.40 | 站点描述（移动端）、极小标注 |
| `{typography.footer-micro}` | 11px | 400–500 | 1.40 | 页脚区块标题、友链、版权文字 |

### 原则

- 全站等宽：所有字号均以 Geist Mono 呈现，无字体切换跳跃
- 站点名称用 `tracking-tight`（`-0.025em`）；页脚区块标题用 `tracking-wide`（`+0.05em`）
- `text-[10px]` / `text-[11px]` 是有意的超小尺寸，用于信息降级区域
- 首页字重三档（400/500/600）；管理面板允许 700（`font-bold`）用于品牌名
- 不使用斜体；`uppercase` 仅限快捷键覆盖层的 "Shortcuts" 标题

## 布局

### 页面结构

```
┌──────────────────────── max-w-5xl (1024px) ────────────────────────┐
│  header: [logo] [站点名] ···················· [社交图标列表]        │
│  ─────────────────────────────────────────────────────────────────  │
│  toolbar: [时钟/问候语] ············· [搜索 | 内外网 | 主题]        │
│                                                                     │
│           [全部]  [分类A]  [分类B]  ···  ← category-tab-bar        │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  site-card   │  │  site-card   │  │  site-card   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│  ··· grid-cols-2 (mobile) → grid-cols-3 (lg) ···                  │
│  ─────────────────────────────────────────────────────────────────  │
│  footer: [友情链接区块] [赞助商区块] [版权文字]                    │
└────────────────────────────────────────────────────────────────────┘
```

### 网格 & 容器

- max-w-5xl（64rem），水平 padding：`px-4` → `sm:px-6` → `lg:px-8`
- 站点网格：`grid-cols-2 gap-3`，`lg:grid-cols-3`（1024px+ 切换 3 列）
- 无侧边栏：所有内容在单一垂直流中呈现

### 间距节奏

| 位置 | Tailwind class | 值 |
|---|---|---|
| 页面顶部内边距 | `pt-8` | 32px |
| header 底部 | `mb-8` | 32px |
| toolbar 底部 | `mb-8` | 32px |
| category-tab-bar 底部 | `mb-6` | 24px |
| 站点卡片间距 | `gap-3` | 12px |
| 页脚顶部 | `pt-8` | 32px |
| 页脚底部 | `pb-4` | 16px |
| 页脚各区块间距 | `gap-6` | 24px |

## 阴影 & 深度

HomeDir 是极平设计。`--shadow-opacity: 0` 为默认值，所有阴影都极为克制。

| 层级 | 处理 | 用途 |
|---|---|---|
| 0（扁平） | 无阴影，`{colors.border}` 1px 边框 | 工具栏容器、分类标签栏 |
| 1（卡片静态） | `var(--shadow-sm)` `0 1px 2px / 0 1px 3px -1px` 透明度 3–4% | 站点卡片默认 |
| 2（卡片悬浮） | `var(--shadow-md)` `0 4px 6px -1px / 0 2px 4px -2px` 透明度 5–7% | 站点卡片 hover |
| 3（弹出层） | `var(--shadow-xl)` `0 20px 25px -5px / 0 8px 10px -6px` 透明度 8% | 快捷键覆盖面板 |
| 4（对话框） | `var(--shadow-2xl)` `0 25px 50px -12px` 透明度 20% | 搜索 Dialog、模态框 |

**原则**：阴影颜色始终是纯黑 `hsl(0 0% 0%)`，通过极低透明度（3–8%）表达深度，
不使用彩色阴影。hover 从 shadow-sm 升至 shadow-md，配合边框和背景色变化共同传达浮起感。

## 形状

### 圆角体系

圆角由 CSS 变量 `--radius: 1rem`（16px）衍生，所有值在运行时计算。

| Token | 计算值（当前 --radius=1rem） | 用途 |
|---|---|---|
| `{rounded.sm}` | 12px（`--radius - 4px`） | 快捷键面板键帽图片等小尺寸圆角 |
| `{rounded.md}` | 14px（`--radius - 2px`） | 搜索结果图标容器；xs/sm 按钮基础圆角（受 `min()` 限制，见下）；上传图标图片（`rounded-md`） |
| `{rounded.lg}` | 16px（`--radius`，基值） | 标准按钮（default/lg/icon）、分类标签按钮、站点图标容器（移动端） |
| `{rounded.xl}` | 20px（`--radius + 4px`） | 站点卡片、工具栏容器、站点图标容器（sm+） |
| `{rounded.2xl}` | 28.8px（`--radius × 1.8`） | 分类标签栏容器、空状态虚线边框 |
| `{rounded.3xl}` | 35.2px（`--radius × 2.2`） | 快捷键覆盖面板（`rounded-3xl`） |
| `{rounded.4xl}` | 41.6px（`--radius × 2.6`） | 徽章（badge，`rounded-4xl`） |
| `{rounded.full}` | 9999px | 管理面板快捷键序号圆形、部分图标占位 |

> **按钮小尺寸的实际圆角**：xs 按钮用 `rounded-[min(var(--radius-md),10px)]` = 10px；
> sm 按钮用 `rounded-[min(var(--radius-md),12px)]` = 12px——比 `{rounded.md}` 更小，
> 是为了在小高度按钮上保持圆角不超过自身高度的一半。

**嵌套规律**：容器比其内容大一档圆角——卡片 xl，卡片内图标容器 lg；标签栏 2xl，
标签按钮 lg。按钮本体使用 `{rounded.lg}`，不使用全圆角胶囊，保持终端工具的克制感。

## 组件

> 所有 hover 状态通过 `transition-all` / `transition-colors` 过渡，持续时间通常 150–200ms。

### 站点卡片（`site-card`）

核心内容单元，整个 `<a>` 标签可点击，`target="_blank" rel="noopener"`。

**`site-card`** — 默认状态
- 背景 `{colors.card}`，圆角 `{rounded.xl}`，内边距 `p-3`（sm: `p-4`）
- 边框 `1px solid {colors.border}`，阴影 `var(--shadow-sm)`
- 布局：`flex items-center gap-2.5`（sm: `gap-3.5`）

**`site-card-hover`** — hover 升档
- 边框切换为 `1px solid {colors.foreground}/15`
- 背景切换为 `{colors.accent}/50`
- 阴影升至 `var(--shadow-md)`

**`site-icon-container`** — 图标容器（移动端）
- 背景 `{colors.muted}`，尺寸 `32px`，圆角 `{rounded.lg}`
- Lucide SVG `14px`；上传图片 `20px rounded-md object-contain`

**`site-icon-container-lg`** — 图标容器（sm+）
- 背景 `{colors.muted}`，尺寸 `40px`，圆角 `{rounded.xl}`
- Lucide SVG `16px`；上传图片 `24px rounded-md object-contain`

**文字区** — `min-w-0 flex-1`
- 站点名：`text-xs font-medium truncate`（sm: `text-sm`）
- 描述：`text-[10px] text-muted-foreground mt-0.5 truncate`（sm: `text-xs`）

### 分类标签栏（`category-tab-bar`）

居中显示，`inline-flex flex-wrap`，用于按分类筛选站点网格。

**容器**（`category-tab-bar`）
- 背景 `{colors.muted}/40`，圆角 `{rounded.2xl}`，内边距 `p-1`，边框 `1px solid {colors.border}`

**非活跃标签**（`category-tab`）
- 背景透明，文字 `{colors.muted-foreground}`，`text-xs font-medium`
- 圆角 `{rounded.lg}`，内边距 `px-3 py-1.5`

**活跃标签**（`category-tab-active`）
- 文字 `{colors.background}`（在 indicator 层之上，`relative z-10`）
- 活跃 indicator（`category-tab-indicator`）：绝对定位，`bg-foreground rounded-lg`
- 过渡：`transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]`，CSS 计算 width/height/left/top
- SSR 骨架：挂载前直接给活跃标签设 `bg-foreground text-background`，避免水合错位

### 工具栏按钮组（`toolbar-group`）

右上角工具区，容纳搜索、内外网切换、主题切换三个图标控件。

- 容器：`rounded-xl border bg-muted/40 p-1`，`flex items-center gap-1`
- 每个图标按钮：`h-8 px-2 text-muted-foreground hover:text-foreground`，`ghost` variant
- 分隔线：`mx-0.5 h-4 w-px bg-border`

### 页头（`header`）

服务端渲染，0 JS。`flex items-center gap-2.5 mb-8`。

- Logo：`size-5 shrink-0 rounded object-contain`（图片）或 Lucide `Terminal` 图标（`size-5 shrink-0`）
- 站点名：`text-sm font-semibold tracking-tight min-w-0 flex-1 truncate`
- 社交链接（`social-link`）：右侧对齐，每个图标 `size-4 text-muted-foreground/50`，
  hover 时升至 `text-muted-foreground`；`gap-3` 间距

### 按钮（`button`）

shadcn/ui Button，基础圆角 `{rounded.lg}`，非胶囊。

| 尺寸 | 高度 | 实际圆角 | 字号 |
|---|---|---|---|
| `xs` | 24px | 10px（`min(--radius-md, 10px)`） | 12px |
| `sm` | 28px | 12px（`min(--radius-md, 12px)`） | 12.8px |
| `default` | 32px | 16px（`{rounded.lg}`） | 14px |
| `lg` | 36px | 16px（`{rounded.lg}`） | 14px |
| `icon` | 32×32px | 16px（`{rounded.lg}`） | — |
| `icon-sm` | 28×28px | 12px（`min(--radius-md, 12px)`） | — |
| `icon-xs` | 24×24px | 10px（`min(--radius-md, 10px)`） | — |

变体：`default`（primary 背景）、`outline`、`secondary`、`ghost`、`destructive`、`link`。
焦点：`ring-3 ring-ring/50`。禁用：`opacity-50 pointer-events-none`。

### 徽章（`badge`）

shadcn/ui Badge，`rounded-4xl`（`--radius × 2.6` = **41.6px**，接近全圆），高度 `h-5`，内边距 `px-2`，`text-xs font-medium`。

| 变体 | 背景 | 文字 |
|---|---|---|
| `default` | `{colors.primary}` | `{colors.primary-foreground}` |
| `secondary` | `{colors.secondary}` | `{colors.secondary-foreground}` |
| `outline` | transparent | `{colors.foreground}`，`border-border` |
| `destructive` | `{colors.destructive}/10` | `{colors.destructive}` |
| `ghost` | transparent，hover `{colors.muted}` | `{colors.muted-foreground}` |

### 空状态（`empty-state`）

站点列表为空时替代网格，引导用户前往后台添加。

- `flex items-center justify-center rounded-2xl border border-dashed py-24`
- 文字 `text-sm text-muted-foreground`
- 内含跳转 `/admin` 的下划线链接：`underline underline-offset-4 hover:text-foreground`

### 时钟（`Clock`）

工具栏左侧，问候语 + 时间的两行小组件。

- 问候语：`text-xs text-muted-foreground`（"早上好 👋" 等）
- 时间：`NumberFlow` 动画数字，`HH:MM:SS` 格式，数字滚动而非跳变
- SSR 骨架：`h-4 w-16 animate-pulse rounded bg-muted-foreground/10`

### 快捷键覆盖层（`shortcut-overlay`）

按住 `Mod`（Mac: ⌘，其他: Ctrl）时全屏显示。

- 背景遮罩：`fixed inset-0 z-50 backdrop-blur-xl backdrop-saturate-150`，`fade-in duration-150`
- 中央面板（`shortcut-overlay`）：`w-96 rounded-3xl border bg-card/80 p-10 shadow-xl backdrop-blur-sm`
  动画：`zoom-in-95 duration-200`
- 标题：`text-xs font-medium tracking-widest text-muted-foreground/40 uppercase`（"Shortcuts"）
- 每行快捷键：`flex items-center justify-between rounded-xl px-4 py-3 hover:bg-muted/40`
- 标签文字：`text-base`（站点名）
- 键帽（`shortcut-key`）：`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border bg-background text-xs font-medium text-muted-foreground shadow-sm`
  每个按键独立展示，`Mod` + `字母` 两个键帽并排，`gap-1.5`

### 搜索对话框（`search-dialog`）

`Cmd+K` / 工具栏搜索按钮触发，shadcn/ui CommandDialog。

- `CommandInput`：搜索框，placeholder "搜索服务…"
- `CommandList`：结果列表，按分类 `CommandGroup` 分组
- 结果项（`CommandItem`）：`gap-3`
  - 图标容器（`search-dialog-icon-container`）：`size-9 rounded-md bg-muted/80`
  - 文字：站点名 `text-sm font-medium` + hostname `text-xs text-muted-foreground/60 truncate`
- 空状态：Search 图标（`stroke-[1.5]`）+ "没有找到相关服务"

### 内外网切换（`NetworkToggle`）

工具栏内 ghost icon-sm 按钮，在内网/外网 URL 间切换打开目标。

- 内网模式：`Server` 图标（`size-3.5`）；外网模式：`Globe` 图标
- 切换时 `toast()` 提示当前模式，包含对应图标
- 开启 `auto_detect_network` 时，首次加载并发探测 3 个内网 URL（2s 超时）；
  手动切换后设 `manualOverride`，本次会话不再自动探测

### 页脚区块（`footer-sections`）

友情链接和赞助商均为服务端渲染，0 JS。两个区块均空时返回 `null`。

**友情链接区块**
- 区块标题（`footer-section-heading`）：`text-[11px] font-medium tracking-wide text-muted-foreground/50`
- 链接列表：`flex flex-wrap justify-center gap-x-4 gap-y-1.5`
- 单个链接（`footer-friend-link`）：`text-[11px] text-muted-foreground/60 hover:text-foreground`

**赞助商区块**
- 区块标题同上
- logo 图片（`footer-sponsor-logo`）：`h-6 w-auto max-w-28 object-contain opacity-50 grayscale`，
  hover 时 `opacity-100 grayscale-0`，`transition`

### 页脚文字

`text-[11px] text-muted-foreground/60`，支持 `dangerouslySetInnerHTML`（可嵌入链接），
链接样式：`no-underline hover:text-muted-foreground`。

## 主题切换动画

HomeDir 的主题切换是最具辨识度的视觉特征，由 CSS View Transitions API 实现。

```css
/* 切换到深色：斜面从左下向右上擦入 */
@keyframes reveal-dark {
  from { clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%); }
  to   { clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%); }
}
/* 切换到浅色：斜面从右上向左下收拢 */
@keyframes reveal-light {
  from { clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%); }
  to   { clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%); }
}
```

- 时长：1s，`cubic-bezier(0.16, 1, 0.3, 1)`（快速启动，缓慢收尾）
- 旧主题快照：`animation: none; z-index: -1`（静止在底层）
- 新主题快照：执行 clip-path 动画，在顶层擦入
- 触发条件：仅当 `[data-theme-switching]` 属性存在时激活，避免页面刷新时触发

### 降级规则（重要）

浏览器不支持 View Transitions API 或用户开启了「减少动态效果」偏好时，**直接切换主题，
不播放动画**。判断顺序：

```ts
if (
  !(document as any).startViewTransition ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  setTheme(next);  // 立即切换，无动画
  return;
}
// 否则触发 clip-path 过渡
```

新增动画效果时必须同样遵守 `prefers-reduced-motion`：所有 CSS animation / transition
都应包含 `@media (prefers-reduced-motion: reduce)` 降级，或在触发前检查 matchMedia。

## 动效原则

| 元素 | 当前值 | 缓动 | 降级 |
|---|---|---|---|
| 主题切换 clip-path | 1s | `cubic-bezier(0.16, 1, 0.3, 1)` | ✅ 已实现（检测 `prefers-reduced-motion` + `startViewTransition` 支持） |
| 分类标签滑块 | 300ms | `cubic-bezier(0.25, 1, 0.5, 1)` | ✅ 已加 `motion-reduce:transition-none` |
| 骨架闪烁 | `animate-pulse` | ease-in-out | ✅ 已加 `motion-reduce:animate-none` |
| 快捷键面板进场 | 200ms `zoom-in-95` | ease | ⚠ 动画类（`animate-in`/`zoom-in-95`）无对应 CSS 规则，实际无进场动画；待补实现 |
| 快捷键背景淡入 | 150ms `fade-in` | ease | ⚠ 同上，`fade-in` 无 CSS 规则 |
| 通用 hover 过渡 | 150–200ms | `ease-out` | — |
| 时钟数字滚动 | NumberFlow 默认 | — | — |

**原则**：
- 快捷操作（hover、选中）用短时（150ms），有重量感的面板进场用稍长（200–300ms）
- 主题切换是例外的长动画（1s），因为它覆盖整个视口，需要充分的过渡时间
- 新增动画时统一使用 `motion-reduce:animate-none` 或 `motion-reduce:transition-none` 降级
- **快捷键面板进场动画**：`animate-in`/`zoom-in-95`/`fade-in` 类依赖 `tailwindcss-animate` 或等效实现，
  项目目前未安装；若要实现进场效果，需先补 CSS，再加对应降级

## 无障碍

### 交互目标尺寸

| 控件 | 当前高度 | 状态 |
|---|---|---|
| 站点卡片 | ~56px（移动端） | ✅ 充足 |
| 分类标签按钮 | ~28px（`py-1.5`）× 宽度自适应 | ✅ 满足 24×24px 最低要求；扩大到 32px 是改善易点按性的产品目标 |
| 工具栏图标按钮 | 32px（`h-8`） | ✅ 已升级 |
| 主题/网络切换 | 32px（`h-8`） | ✅ 已升级 |

### 键盘焦点

全局 `@apply outline-ring/50` 设置了轮廓颜色，但不能保证每个元素都出现可见焦点环。
实际状态：

- shadcn/ui **Button** 组件已有 `focus-visible:ring-3 focus-visible:ring-ring/50` ✅
  - 工具栏搜索按钮、内外网切换按钮均使用该组件，焦点环已具备
- 分类标签 `<button>`（原生）：已有 `focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none` ✅
- 主题切换按钮（原生 `<button>`）：已有 `focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none` ✅

### 图标按钮文字标签

纯图标按钮须提供文字描述：

| 按钮 | 当前状态 |
|---|---|
| 主题切换 | `title={labelMap[current]}` ✅ |
| 内外网切换 | `title` + `aria-label`（描述点击动作，随状态切换）✅ |
| 搜索图标 | `aria-label="搜索"` ✅ |
| 社交链接 | `aria-label={label}` ✅ |

### 文字对比度

极小字号需要更高对比度，以下项目需验证：

| 文字 | 颜色 | 字号 | 状态 |
|---|---|---|---|
| 站点描述（移动端） | `muted-foreground` | 10px | 需验证 WCAG AA（小文字要求 4.5:1） |
| 页脚友链 | `muted-foreground/60` | 11px | 需验证（透明度叠加后对比度下降） |
| Shortcuts 标题 | `muted-foreground/40` | 12px | ⚠ 有意弱化，仅在暗背景覆盖层下勉强可读 |
| 分类标签非活跃 | `muted-foreground` | 12px | 需验证 |

### 分类选中语义

当前分类标签 `<button>` 缺少语义属性。**目标规格**（推荐方案）：

```tsx
<button
  aria-pressed={active === cat}
>
```

使用 `aria-pressed` 是较直接的方案。若将来改用 `role="tab"` + `aria-selected`，
还需同步实现 `role="tablist"`、`tabpanel` 及完整的方向键导航行为，
不能只替换两个属性。选定一种后保持一致。

### 快捷键覆盖层焦点行为

快捷键覆盖层是 **按住 Mod 键显示、松开即消失** 的提示面板，不含可操作控件。
不应在其打开时移动焦点——强行移焦会打断用户原本的键盘操作流程。

若将来改成可持续打开的交互面板（含可点击条目），再定义焦点捕获和还原逻辑。

## Do's and Don'ts

### Do

- 保持 Geist Mono 为唯一字体，不引入第二字体族
- 品牌界面以绿青色相（hue 155/173.6）为主；destructive 是允许的语义例外
- 使用 `muted/40` 作为容器背景（工具栏组、分类标签栏），保持层次感
- 使用 `foreground/15` 作为卡片 hover 边框色，轻而不失存在感
- 站点卡片保持 `rounded-xl`，图标容器保持 `rounded-lg`（内比外小一档）
- 文字降级用透明度分层：`/50` → `/60` → `/40`，不新增色值
- 新增按钮优先选 `ghost` 或 `outline` variant，主操作才用 `default`
- 用 `destructive` variant 明确区分破坏性操作，不用自定义颜色直接传达危险
- 空状态保持 `border-dashed`，与实体边框视觉区分
- 所有交互元素保持可见焦点轮廓；图标按钮添加 `title` 或 `aria-label`
- 浮层按层级使用更强阴影：覆盖面板 shadow-xl，对话框 shadow-2xl
- 客户端组件读取 `window` / `navigator` / theme 时须用 `mounted` flag 防水合错位
- 新增动画效果时提供 `prefers-reduced-motion` 降级

### Don't

- 不引入任何非等宽字体（包括管理面板）
- 不使用彩色阴影，阴影始终是极低透明度的纯黑
- 不对按钮使用 `rounded-full`（全胶囊）——这打破终端工具的克制感
- 不在界面上用 primary 色大面积铺底背景
- 不增加 `--shadow-opacity` 的默认值（保持扁平基调）
- 不在站点卡片 hover 以外的普通交互层用 shadow-md（保持该升档的语义意义）
- 不省略 `shrink-0` 导致图标容器被内容压缩
- 不引入额外色相做装饰——新增颜色时先问"能否用现有 token 的透明度表达"
- 不在 basic-settings 的保存路径中包含 `social_links`、`friend_links`、`sponsors`，
  否则会用表单旧值覆盖这些字段的专属编辑器数据

## 响应式行为

### 断点

| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 移动端 | < 640px | 2 列网格，卡片 p-3，图标 32px，文字 text-xs / text-[10px] |
| 小屏（sm） | ≥ 640px | 卡片 p-4，图标 40px，文字 text-sm / text-xs |
| 大屏（lg） | ≥ 1024px | 3 列网格，水平 padding px-8 |

### 站点卡片响应细节

- 移动端：`p-3 gap-2.5`，图标 `size-8 rounded-lg`，标题 `text-xs`，描述 `text-[10px]`
- sm+：`p-4 gap-3.5`，图标 `size-10 rounded-xl`，标题 `text-sm`，描述 `text-xs`

### 分类标签栏响应

- `flex-wrap` 允许标签在窄屏自动换行，容器宽度自适应内容
- 滑动指示器在换行后仍能正确跟踪（通过 `offsetLeft` / `offsetTop` 实时计算，`resize` 事件重算）

### 触控目标

- 站点卡片：整行可点击，移动端最小高度约 56px
- 工具栏图标按钮：`h-8`（32px）✅
- 分类标签：`py-1.5`，约 28px 高度，满足 24×24px 最低要求

## 开发规范（设计实现相关）

本节记录与 UI 设计一致性直接相关的实现约束，与设计原则本身区分。

### Server Action

- 修改**页面可见数据**（站点、分类、config）的 Action 在结尾调用受影响路径的
  `revalidatePath("/")` 和/或 `revalidatePath("/admin")`
- 仅返回文件名或中间结果的辅助 Action（如 `fetchFaviconAction`、`uploadIconAction`）
  **不需要** revalidatePath——它们不直接修改可渲染的页面数据
- `src/app/admin/actions.ts` 中**受保护的数据操作** Action 以 `requireAuth()` 开头，返回 `ActionResult` 判别联合类型（`{success:true, data?}` 或 `{success:false, error}`），不向客户端 throw
- 认证类 Action（`loginAction`、`setupAction`、`logoutAction`，位于 `src/app/admin/login/actions.ts`）不调用 `requireAuth()`，成功后通过 `redirect()` 结束，不适用上述规则

### 客户端/服务端边界

- 读取 `window` / `navigator` / `document` 或依赖当前主题的组件须用 `mounted` flag：
  未挂载时渲染骨架，挂载后替换真实内容，避免水合错位
- `src/lib/db.ts`、`src/lib/auth.ts`、`src/lib/sites.ts` 仅在服务端使用，
  不在 `"use client"` 文件中引入

### 图标文件

- 上传/抓取图标走 `uploadIconAction` / `fetchFaviconAction`，存入 `data/icons/`
- 始终通过 `/api/icons/[name]` 路由访问（`getIconUrl()` 负责构造路径），
  不直接引用文件系统路径

### Config 字段同步

新增配置字段时，以下位置需同步更新：
`SiteConfig` 类型 → `defaultConfig` 默认值 → `getConfig()` 映射 →
`/admin/page.tsx` 的 `safeConfig` 白名单 → `SafeConfig` 类型（`admin-panel.tsx`）

### 验证

`pnpm build` 包含 TypeScript 类型检查，是主要验证门；项目无测试框架，不发明测试命令。

## 已知缺口与待办

| 优先级 | 项目 | 说明 |
|---|---|---|
| 中 | 快捷键面板进场动画 | `animate-in`/`zoom-in-95`/`fade-in` 类无 CSS 规则，进场动画实际未生效；需安装实现后再补降级 |
| 中 | 对比度验证 | `muted-foreground/60` 在 11px 处、`/40` 在 12px 处需工具实测 |
| 中 | 管理面板设计规范 | 表单、数据列表、Tab 切换、反馈 toast、空状态未覆盖 |
| 低 | 搜索对话框规格 | CommandDialog 内部样式由 shadcn/ui 内置，未额外记录 |
| 低 | 深色模式合成值 | `muted/40` 在深色模式的实际渲染色值未单独列出 |
