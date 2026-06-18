# MkDocs 布局重构设计方案

> **日期**: 2026-06-18
> **范围**: 全面重构（CSS美化 + 首页布局 + 内容页分栏 + 导航重组）
> **方案**: Material 原生能力 + 自定义 CSS（方案A）

---

## 1. 导航结构重组（生命周期式）

### 当前问题
- "成长通道"和"共建社区"是空壳板块
- 导航分类按功能而非用户场景
- 内容分散在不直观的层级中

### 新导航结构

```
导航标签（tabs）：
├── 🏠 首页 (README.md)
├── 🎓 入学前
│   ├── 开学第0课 (campus-life/first-lesson-of-school.md)
│   ├── 课程与学分 (campus-life/different-courses.md)
│   ├── 签到考勤 (campus-life/class-attendance.md)
│   ├── 转专业须知 (campus-life/major-transfer-guide.md)
│   ├── 辅修/第二学位 (campus-life/minor-or-dual-degree.md)
│   └── 学生邮箱 (campus-life/student-email.md)
├── 📚 在校学习
│   ├── [入口页] (academic-resources/index.md)
│   ├── 学术资源
│   │   ├── 学术研究与写作
│   │   ├── 关键概念
│   │   ├── 毕业论文（理学）
│   │   └── 资源获取
│   ├── 通识技能
│   │   ├── 工具推荐
│   │   ├── 搜索引擎
│   │   ├── 计算机基础
│   │   └── 考试与竞赛
│   └── 学生优惠
├── 🌱 校园生活
│   ├── [入口页] (campus-life/index.md)
│   ├── 人际关系
│   │   ├── 化解矛盾
│   │   ├── 社交关系
│   │   └── 脱单技巧
│   ├── 生活技巧
│   │   ├── 图书馆
│   │   ├── 医保指南
│   │   ├── 国际交流
│   │   └── 生活实用小技巧
│   └── 圆梦帮扶
│       ├── 奖助学金申请
│       ├── 勤工俭学
│       └── 国家助学贷款
├── 🚀 成长通道
│   ├── [入口页] (growth-path/index.md)
│   ├── 就业准备
│   │   └── 企业文化 (general-skills/recruit-exercitation.md)
│   └── ... (预留扩展)
└── 📝 博客 (blog/index.md)
```

### 共建社区内容迁移
- 贡献指南 → 页脚 footer 链接
- 关于 Wiki → 页脚 footer 链接
- 联系我们 → 页脚 footer 链接

---

## 2. 视觉风格（现代活泼）

### 色彩体系
- **主色**: `#2196F3`（Material Blue）
- **强调色**: `#FF9800`（Orange，按钮和高亮）
- **成功色**: `#4CAF50`（Green）
- **渐变装饰**: 蓝→紫渐变用于标题区域

### 卡片样式规范
```css
/* 圆角卡片 + 悬浮阴影 */
.md-typeset .grid > ul > li {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.md-typeset .grid > ul > li:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
```

### Admonition 美化
- 左侧彩色边框增强（3px → 4px）
- 圆角化 admonition 容器
- 图标大小增大
- 内边距优化

---

## 3. 内容布局

### 3.1 板块入口页（Grid Cards）

每个板块 README.md 使用 Material grid 系统：

```markdown
# 在校学习

<div class="grid cards" markdown>

- :material-book-open:{ .lg .middle } __学术资源__

    ---

    学术写作、毕业论文、资源获取

    [:octicons-arrow-right-24: 进入](academic-resources/index.md)

- :material-tools:{ .lg .middle } __通识技能__

    ---

    工具推荐、生活技巧、学习方法

    [:octicons-arrow-right-24: 进入](general-skills/index.md)

</div>
```

### 3.2 内容页侧边栏（相关推荐）

在内容页顶部添加美化后的 admonition 作为相关链接推荐：

```markdown
!!! abstract "📌 相关推荐"
    - [学生优惠](../student-discounts.md)
    - [银行账户](../bank-accounts.md)
    - [搜索引擎](../search-platforms.md)
```

CSS 将 admonition 改造为视觉侧边栏效果。

### 3.3 首页重构

首页 README.md 重构为四区域：

1. **Hero 区域**: Logo + 项目标语 + CTA 按钮（开始阅读 / 参与贡献）
2. **特色卡片**: 4个 grid cards 展示项目特色（全面覆盖 / 开放共建 / 现代技术栈 / 隐私优先）
3. **内容导航**: 按板块分组的卡片墙，每个板块一个大卡片
4. **致谢/社区**: 底部区域（致谢、社区链接、Star History）

---

## 4. 实现细节

### 需要修改的文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `mkdocs.yml` | 修改 | 重组 nav 结构，启用/调整 features |
| `src/overrides/assets/stylesheets/extra.css` | 修改 | 新增 ~200 行自定义 CSS |
| `docs/README.md` | 重写 | 首页 Hero + 卡片墙布局 |
| `docs/academic-resources/README.md` | 重写 | 板块入口 grid cards |
| `docs/general-skills/README.md` | 重写 | 板块入口 grid cards |
| `docs/campus-life/README.md` | 新建 | 板块入口 grid cards |
| `docs/growth-path/README.md` | 重写 | 板块入口 grid cards |
| `docs/community-hub/README.md` | 精简 | 仅保留贡献指南内容 |
| 各内容页 `*.md` | 微调 | 顶部添加"相关推荐"admonition |

### CSS 自定义内容

1. 卡片网格样式增强（圆角、阴影、悬浮效果）
2. Admonition 美化（边框、圆角、图标）
3. 首页 Hero 区域样式
4. 相关推荐侧边栏样式
5. 响应式适配（移动端卡片单列）

### mkdocs.yml 变更

1. 重组 `nav` 结构
2. 确认 `navigation.tabs` + `navigation.sections` 启用
3. 添加 `navigation.path` 或 `navigation.top` 等辅助功能

---

## 5. 不变项

- 保持所有现有 Markdown 内容不变
- 保持 giscus 评论系统
- 保持 vercount 访客统计
- 保持 MathJax 数学公式支持
- 保持 blog 插件和 RSS
- 保持 git-revision-date 插件
- 保持隐私插件配置

---

## 6. 验证标准

- [ ] 导航结构清晰，用户能按生命周期找到内容
- [ ] 首页视觉效果现代活泼，卡片有悬浮交互
- [ ] 板块入口页用 grid cards 展示子页面
- [ ] 内容页有相关推荐入口
- [ ] 移动端响应式正常
- [ ] 深色模式下样式正常
- [ ] 所有现有功能不受影响
