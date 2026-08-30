<div align="center">

![preview](preview.png)

# HomeDir

---

*轻量、快速的个人服务导航页，专为管理内外网服务地址而设计。*

</div>

## 这个 Fork 多了什么

基于 [52Lxcloud/HomeDir](https://github.com/52Lxcloud/HomeDir) v1.1.0，自己长期用下来补的七件事。

**社交名片。** 页头的社交图标全部后台可配，内置 19 个平台：GitHub、Telegram、X、QQ 群、微信、哔哩哔哩、知乎、微博、豆瓣、YouTube、Discord、GitLab、Mastodon、Bluesky、Reddit，再加邮箱、RSS、博客和自定义链接。原版这里写死指向作者仓库，改不了。

**首页分类想怎么排就怎么排。** 后台分类页每张卡片带上下箭头，点一下即时生效。「全部」永远在第一个。

**站点 Logo 和浏览器标签页图标都能换。** 后台直接传图，留空回落到默认图标。

**页脚多了友情链接和赞助商。** 友情链接是文字，赞助商是 logo 图片，都在后台设置页里加，顺序随便调。两个都没配的时候页脚跟原版一模一样，不会多出空板块。

**后台地址从 `/dash` 改成了 `/admin`。** 顺手的问题，没留旧路径的跳转，所以从原版迁过来的话书签要改一下。

**外网跳转可以带来源标识。** 后台开启后，首页卡片、搜索结果和键盘快捷键会给外网地址自动加上 `utm_source` 和 `utm_medium=referral`。内网地址不处理，后台保存的原始链接也不会变。

**Docker 开箱即用。** compose 从本地源码构建，时区已经是上海，文件顶部附了一份命令速查。

<details>
<summary>技术细节</summary>

社交名片的链接协议在服务端做了白名单校验，`javascript:` 这类塞不进去，最多 12 条。新增平台只需要在 `src/lib/social.ts` 的注册表里加一行，前台图标和后台编辑器会自动认。

分类不是独立的表，是从站点的 category 字段派生出来的，原本按字符编码排序，站点一多顺序就很随机。现在顺序存在 config 表的 `category_order` 键里，是个 JSON 名称数组，没动表结构，老的 `sites.db` 直接能用。新建分类落到末尾，重命名保留原位置，删除则从顺序里摘掉。首页「全部」网格里站点的分组次序也跟着标签栏走，两边不会对不上。

Logo 与 favicon 复用了原有的 `data/icons/` 存储和内容哈希去重，分别回落到 Terminal 图标和 `public/icon.svg`。

来源标识保存在 config 表的 `outbound_utm_enabled` 和 `outbound_utm_source` 两个键里。跳转时统一经过 `src/lib/outbound-url.ts` 生成地址；原链接已有 UTM 参数时不会覆盖，外网地址缺失并回落到内网地址时也不会误加。

Docker 镜像里装了 `tzdata` 才设的 `TZ=Asia/Shanghai`。Alpine 用的 musl 不自带时区数据库，光设 TZ 不生效，容器会一直停在 UTC。另外 standalone 构建产物不包含 `public/`，补了一行 COPY，否则默认 favicon 在容器里是 404，本地开发时看不出来。

</details>

## 特性

**导航管理**

- 站点分类管理
- 自动抓取网站 favicon
- 后台可视化管理站点、分类、配置

**效率操作**

- `⌘K` 全局搜索，按名称、描述、地址模糊匹配
- 键盘热键绑定，一键直达常用站点
- 自动探测网络环境，智能切换内网/外网地址

**体验细节**

- 深色 / 浅色主题，跟随系统自动切换
- 主题切换带 View Transition 过渡动画
- 实时时钟 + 时段问候语
- 分类标签栏带滑动指示器动效
- 长按 ⌘ 键浮层显示所有快捷键
- 全局等宽字体（Geist Mono）
- 数据存储 SQLite 单文件，备份迁移方便

## 技术栈

`Next.js 16` `Tailwind CSS v4` `shadcn/ui` `SQLite` `Lucide React`

## 目录结构

```
src/
├── app/              # 页面路由
│   ├── page.tsx      # 首页
│   ├── admin/        # 后台管理
│   └── api/          # API 路由
├── components/       # 组件
│   ├── admin/        # 后台管理组件
│   └── ui/           # shadcn/ui 基础组件
└── lib/              # 工具库
    ├── db.ts         # 数据库操作
    ├── auth.ts       # 认证逻辑
    ├── icons.ts      # 图标处理
    ├── social.ts     # 社交名片平台注册表
    ├── categories.ts # 分类顺序
    └── outbound-url.ts # 外网来源参数
```

## 快速开始

### Docker 部署（推荐）

仓库里的 `docker-compose.yml` 已经配好，从本地源码构建：

```yaml
services:
  homedir:
    build:
      context: .
    image: homedir:local
    container_name: homedir
    restart: unless-stopped
    environment:
      TZ: Asia/Shanghai
    ports:
      - "4027:4027"
    volumes:
      - ./data:/app/data
```

```bash
docker compose up -d --build
```

启动后访问 `http://localhost:4027/admin` 设置管理密码。想用官方镜像的话，把 `build` 换成 `image: 52lxcloud/homedir:latest`，但这样就没有上面那些改动了。

### 本地开发

```bash
pnpm install
pnpm dev
```

访问 `http://localhost:3000/admin` 进入后台。数据保存在 `data/` 目录。

---

如果觉得这个项目对你有帮助，欢迎点个 ⭐ 支持一下。
