/**
 * 首页分类顺序。
 *
 * 分类不是独立的表，而是从 sites.category 派生出来的，因此顺序单独存在
 * config 表的 category_order 键里（JSON 名称数组）。数组只表达「顺序」，
 * 不代表分类是否存在 —— 真实分类始终以站点数据为准。
 */

/** 解析 category_order 配置值，非法或非字符串项一律丢弃 */
export function parseCategoryOrder(value: string): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string" && v.length > 0);
  } catch {
    return [];
  }
}

export function serializeCategoryOrder(order: string[]): string {
  return JSON.stringify(order);
}

/**
 * 按保存的顺序排列分类：已排序的在前（按数组次序），
 * 未出现在顺序表里的（新建分类）排在最后，按名称升序。
 */
export function sortCategories(categories: string[], orderValue: string): string[] {
  const order = parseCategoryOrder(orderValue);
  const rank = new Map(order.map((name, i) => [name, i]));

  return [...categories].sort((a, b) => {
    const ra = rank.get(a);
    const rb = rank.get(b);
    if (ra !== undefined && rb !== undefined) return ra - rb;
    if (ra !== undefined) return -1;
    if (rb !== undefined) return 1;
    return a.localeCompare(b, "zh-Hans-CN");
  });
}

/** 重命名后同步顺序表，保持原有位置 */
export function renameInCategoryOrder(orderValue: string, oldName: string, newName: string): string {
  const order = parseCategoryOrder(orderValue);
  const idx = order.indexOf(oldName);
  if (idx === -1) return serializeCategoryOrder(order);
  // 新名称若已在表中，去掉旧项即可，避免重复
  order[idx] = newName;
  return serializeCategoryOrder(order.filter((name, i) => order.indexOf(name) === i));
}

/** 删除分类后从顺序表剔除 */
export function removeFromCategoryOrder(orderValue: string, name: string): string {
  return serializeCategoryOrder(parseCategoryOrder(orderValue).filter((n) => n !== name));
}
