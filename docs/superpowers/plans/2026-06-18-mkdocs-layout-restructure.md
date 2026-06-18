# MkDocs Layout Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure Ac-Wiki's MkDocs layout — lifecycle-based navigation, modern card-based visual design, section index pages with grid cards, and content page sidebar recommendations.

**Architecture:** Material for MkDocs native grid cards + admonitions + custom CSS (~200 lines). No Jinja2 template overrides. Navigation reorganized by student lifecycle (入学前 → 在校学习 → 校园生活 → 成长通道). Homepage rewritten with Hero section and card wall.

**Tech Stack:** MkDocs, Material for MkDocs theme, Custom CSS (extra.css), Markdown with attr_list + md_in_html extensions.

## Global Constraints

- All existing Markdown content must remain unchanged (only prepend "相关推荐" admonitions)
- Existing plugins (giscus, vercount, MathJax, blog, RSS, git-revision-date, privacy) must not be broken
- CSS must work in both light and dark mode (use CSS custom properties where possible)
- Mobile responsive: cards stack to single column on small screens
- Primary color: `#2196F3`, Accent: `#FF9800`, Success: `#4CAF50`

---

### Task 1: CSS Foundation — Custom Styles

**Files:**
- Modify: `src/overrides/assets/stylesheets/extra.css`

**Interfaces:**
- Consumes: Material for MkDocs CSS custom properties (`--md-primary-fg-color`, etc.)
- Produces: CSS classes used by all subsequent tasks (`.hero`, `.grid.cards` enhancements, `.related-links`, admonition overrides)

- [ ] **Step 1: Append custom CSS to extra.css**

Read the current file (12 lines), then append the following after the existing content:

```css
/* ============================================================
   Ac-Wiki Custom Layout Styles
   ============================================================ */

/* --- Hero Section (Homepage) --- */
.hero {
    text-align: center;
    padding: 3rem 1rem 2rem;
    margin-bottom: 2rem;
}
.hero h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--md-primary-fg-color), #7c4dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.hero p {
    font-size: 1.2rem;
    color: var(--md-default-fg-color--light);
    margin-bottom: 1.5rem;
}
.hero .hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}
.hero .hero-buttons .md-button {
    border-radius: 8px;
    padding: 0.6rem 1.5rem;
    font-weight: 600;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hero .hero-buttons .md-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.hero .hero-buttons .md-button--primary {
    background: var(--md-primary-fg-color);
    color: var(--md-primary-bg-color);
}

/* --- Grid Cards Enhancement --- */
.md-typeset .grid.cards > ul > li,
.md-typeset .grid > ul > li {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: 1px solid var(--md-default-fg-color--lightest);
}
.md-typeset .grid.cards > ul > li:hover,
.md-typeset .grid > ul > li:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    border-color: var(--md-primary-fg-color);
}

/* --- Admonition Enhancements --- */
.md-typeset .admonition,
.md-typeset details {
    border-radius: 10px;
    border-left-width: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.md-typeset .admonition > .admonition-title,
.md-typeset details > summary {
    border-radius: 10px 10px 0 0;
    font-weight: 600;
}
.md-typeset .admonition > .admonition-title::before,
.md-typeset details > summary::before {
    font-size: 1.1em;
}

/* --- Related Links Sidebar --- */
.related-links {
    background: var(--md-code-bg-color);
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 10px;
    padding: 1rem 1.2rem;
    margin-bottom: 1.5rem;
    font-size: 0.85rem;
}
.related-links p {
    margin: 0 0 0.5rem 0;
    font-weight: 600;
    color: var(--md-primary-fg-color);
}
.related-links ul {
    margin: 0;
    padding-left: 1.2rem;
}
.related-links li {
    margin-bottom: 0.3rem;
}
.related-links a {
    color: var(--md-default-fg-color);
    text-decoration: none;
    transition: color 0.2s;
}
.related-links a:hover {
    color: var(--md-primary-fg-color);
}

/* --- Section Header Decoration --- */
.md-typeset h1 {
    position: relative;
    padding-bottom: 0.5rem;
}
.md-typeset h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--md-primary-fg-color), #7c4dff);
    border-radius: 2px;
}

/* --- Feature Cards (Homepage) --- */
.feature-cards .md-typeset .grid > ul > li {
    text-align: center;
    padding: 1.5rem 1rem;
}
.feature-cards .md-typeset .grid > ul > li > .twemoji {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

/* --- Footer Enhancements --- */
.md-copyright {
    text-align: center;
    font-size: 0.8rem;
    line-height: 1.6;
}
.page-stats {
    margin: 0.5em 0;
    font-size: 0.75em;
    color: var(--md-footer-fg-color--light);
}

/* --- Responsive Adjustments --- */
@media screen and (max-width: 76.1875em) {
    .hero h1 {
        font-size: 1.8rem;
    }
    .hero p {
        font-size: 1rem;
    }
}
```

- [ ] **Step 2: Verify CSS loads without syntax errors**

Run: `mkdocs build --strict 2>&1 | head -20`
Expected: Build completes without CSS-related warnings. If there are errors, fix the CSS syntax.

- [ ] **Step 3: Commit**

```bash
git add src/overrides/assets/stylesheets/extra.css
git commit -m "feat: add custom CSS for layout restructure (cards, hero, admonitions, sidebar)"
```

---

### Task 2: Navigation Restructure (mkdocs.yml)

**Files:**
- Modify: `mkdocs.yml` (nav section only, lines 1-61)

**Interfaces:**
- Consumes: All existing doc files (paths must match)
- Produces: New navigation structure consumed by Material theme

- [ ] **Step 1: Replace the nav section in mkdocs.yml**

Replace lines 1-61 (the `draft_docs` + `nav` block) with:

```yaml
draft_docs: drafts/
nav:
    - 首页: README.md
    - 入学前:
          - campus-life/first-lesson-of-school.md
          - 课程与学分: campus-life/different-courses.md
          - 签到考勤: campus-life/class-attendance.md
          - 转专业须知: campus-life/major-transfer-guide.md
          - 辅修/第二学位: campus-life/minor-or-dual-degree.md
          - 学生邮箱: campus-life/student-email.md
    - 在校学习:
          - academic-resources/README.md
          - 学术资源:
                - 学术研究和学术写作: academic-resources/academic-research-and-academic-writing.md
                - 一些关键概念: academic-resources/some-key-concepts.md
                - 毕业论文（理学）: academic-resources/thesis-bachelor-science.md
                - 资源:
                      - 网络资源获取指南: academic-resources/how-to-get-resources.md
                      - 有用的开源项目: academic-resources/useful-open-source-projects.md
                      - 数学: academic-resources/math/learning-resources.md
          - 通识技能:
                - general-skills/README.md
                - 搜索引擎: general-skills/search-platforms.md
                - 工具推荐: general-skills/tools.md
                - 计算机基础: general-skills/computer-basic/SurfingTutorial.md
                - 考试和竞赛: general-skills/study/study.md
          - 学生优惠: general-skills/student-discounts.md
    - 校园生活:
          - campus-life/README.md
          - 人际关系:
                - 化解矛盾: campus-life/resolving-conflicts.md
                - 社交关系: campus-life/social-connections.md
                - 脱单技巧: campus-life/getting-out-of-singleness.md
          - 生活技巧:
                - 图书馆: campus-life/library.md
                - 医保指南: campus-life/medical-insurance.md
                - 国际交流: campus-life/international-exchange.md
                - 生活实用小技巧: general-skills/life-tips.md
                - 旅行健康手册: general-skills/health-when-travelling.md
                - 保健手段: general-skills/health.md
          - 圆梦帮扶:
                - 奖助学金申请: campus-life/scholarship.md
                - 勤工俭学申请: campus-life/work-study-program.md
                - 国家助学贷款: campus-life/faq-national-student-loan.md
    - 成长通道:
          - growth-path/README.md
          - 就业准备:
                - 企业文化: general-skills/recruit-exercitation.md
          - 网络安全:
                - 密码管理: general-skills/password_manage.md
                - 隐私保护: general-skills/cyber security/privacy.md
          - 奇技淫巧:
                - 校园跑: general-skills/qi-ji-yin-qiao/campus-running.md
                - 刷课: general-skills/qi-ji-yin-qiao/pointless-courses.md
          - 方法论:
                - 银行账户与信用卡: general-skills/bank-accounts-and-credit-cards.md
    - 博客:
          - blog/index.md
```

- [ ] **Step 2: Verify build with new nav**

Run: `mkdocs build --strict 2>&1 | grep -E "(ERROR|WARNING|warning)" | head -20`
Expected: No errors about missing files. Some warnings about orphan pages are OK.

- [ ] **Step 3: Commit**

```bash
git add mkdocs.yml
git commit -m "refactor: reorganize nav to lifecycle-based structure"
```

---

### Task 3: Homepage Rewrite (Hero + Cards)

**Files:**
- Modify: `docs/README.md`

**Interfaces:**
- Consumes: CSS classes from Task 1 (`.hero`, `.feature-cards`)
- Produces: Visual homepage referenced by nav "首页" entry

- [ ] **Step 1: Rewrite docs/README.md**

Replace the entire file with:

```markdown
<div class="hero" markdown>

# Ac-Wiki

**专为大学生群体打造的知识共享平台，助力学业与社会衔接**

[![License](https://img.shields.io/github/license/Ac-Wiki/Ac-Wiki?style=flat-square&color=2196f3)](https://github.com/Ac-Wiki/Ac-Wiki/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/Ac-Wiki/Ac-Wiki?style=flat-square&logo=github&logoColor=white&color=ff9800)](https://github.com/Ac-Wiki/Ac-Wiki/stargazers)

<div class="hero-buttons" markdown>

[:material-book-open: 开始阅读](campus-life/first-lesson-of-school.md){ .md-button .md-button--primary }
[:material-github: 参与贡献](https://github.com/Ac-Wiki/Ac-Wiki){ .md-button }

</div>

</div>

---

## ✨ 项目特色

<div class="feature-cards" markdown>

<div class="grid cards" markdown>

- :material-school:{ .lg .middle } **全面覆盖**

    ---

    从校园生活到学术技能，从学生优惠到网络安全，提供大学生全生命周期的知识支持。

- :material-account-group:{ .lg .middle } **开放共建**

    ---

    所有内容开源开放，任何人都可以参与编辑和改进，共建属于大学生的知识库。

- :material-tools:{ .lg .middle } **现代技术栈**

    ---

    基于 MkDocs Material 主题构建，支持深色模式、全文搜索、即时导航和博客功能。

- :material-shield-check:{ .lg .middle } **隐私优先**

    ---

    无广告、无追踪、无商业目的，纯粹的公益知识共享项目。

</div>

</div>

---

## 📚 内容导航

<div class="grid cards" markdown>

- :material-school:{ .lg .middle } **🎓 入学前**

    ---

    开学准备、课程了解、转专业指南

    [:octicons-arrow-right-24: 开始阅读](campus-life/first-lesson-of-school.md)

- :material-book-open-variant:{ .lg .middle } **📚 在校学习**

    ---

    学术资源、通识技能、学生优惠

    [:octicons-arrow-right-24: 开始阅读](academic-resources/README.md)

- :material-flower:{ .lg .middle } **🌱 校园生活**

    ---

    人际关系、生活技巧、圆梦帮扶

    [:octicons-arrow-right-24: 开始阅读](campus-life/README.md)

- :material-rocket-launch:{ .lg .middle } **🚀 成长通道**

    ---

    就业准备、技能提升、方法论

    [:octicons-arrow-right-24: 开始阅读](growth-path/README.md)

</div>

---

## 🙏 致谢

感谢 **[方山厨子](https://space.bilibili.com/274459325)** 提供的《成年人社会生活常识课》系列视频，为本项目提供了大量实用的社会生活知识。

感谢所有参与到开发与维护中的贡献者，是大家的帮助让 Ac-Wiki 越来越好！

<div align="center">
  <a href="https://github.com/Ac-Wiki/Ac-Wiki/graphs/contributors">
    <img src="https://contributors-img.web.app/image?repo=Ac-Wiki/Ac-Wiki&max=200&columns=12" alt="贡献者" />
  </a>
</div>

---

## 💬 加入社区

<div align="center">
  <a href="https://t.me/AcWiki">
    <img src="https://img.shields.io/static/v1?label=Telegram&message=频道&color=26A5E4&style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram 频道" />
  </a>
  <a href="https://t.me/AcFourm">
    <img src="https://img.shields.io/static/v1?label=Telegram&message=群组&color=26A5E4&style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram 群组" />
  </a>
  <a href="https://qm.qq.com/q/WJI3hgBcm4">
    <img src="https://img.shields.io/static/v1?label=QQ&message=860675581&color=12B7F5&style=for-the-badge&logo=tencentqq&logoColor=white" alt="QQ 群" />
  </a>
</div>

<div align="center">
  <a href="https://star-history.com/#Ac-Wiki/Ac-Wiki&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Ac-Wiki/Ac-Wiki&type=Date&theme=dark" />
      <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Ac-Wiki/Ac-Wiki&type=Date" />
      <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Ac-Wiki/Ac-Wiki&type=Date" width="100%" />
    </picture>
  </a>
</div>

---

<div align="center">
  <p><strong>CDN 加速及安全防护由</strong></p>
  <a href="https://edgeone.ai/zh?from=github">
    <img src="./assets/TencentEdgeone.png" alt="Tencent EdgeOne" height="60" />
  </a>
  <p><strong>赞助提供</strong></p>
</div>

---

<div align="center">
  <sub>本项目内容遵循 <a href="./LICENSE-CC-BY-4.0.md">CC BY 4.0</a> 许可协议，源代码遵循 <a href="https://github.com/Ac-Wiki/Ac-Wiki/blob/main/LICENSE">MIT</a> 许可协议</sub>
</div>
```

- [ ] **Step 2: Verify homepage renders**

Run: `mkdocs serve` and open `http://localhost:8000` in browser.
Expected: Hero section visible with gradient title, 4 feature cards, 4 navigation cards, footer with community links.

- [ ] **Step 3: Commit**

```bash
git add docs/README.md
git commit -m "feat: rewrite homepage with hero section and card layout"
```

---

### Task 4: Section Index Pages (Grid Cards)

**Files:**
- Modify: `docs/academic-resources/README.md`
- Modify: `docs/general-skills/README.md`
- Create: `docs/campus-life/README.md`
- Modify: `docs/growth-path/README.md`
- Modify: `docs/community-hub/README.md`

**Interfaces:**
- Consumes: CSS classes from Task 1 (`.grid.cards` enhancements)
- Produces: Section entry pages with card-based navigation

- [ ] **Step 1: Rewrite academic-resources/README.md**

Replace the entire file with:

```markdown
# 学术资源

将涵盖专科、本科、硕士、博士各阶段相对通用的学术技能与指引。

<div class="grid cards" markdown>

- :material-pen:{ .lg .middle } **学术研究与写作**

    ---

    学术规范、论文写作、查重降重

    [:octicons-arrow-right-24: 阅读](academic-research-and-academic-writing.md)

- :material-lightbulb:{ .lg .middle } **关键概念**

    ---

    学术领域的基础概念解析

    [:octicons-arrow-right-24: 阅读](some-key-concepts.md)

- :material-file-document:{ .lg .middle } **毕业论文（理学）**

    ---

    本科毕业论文写作完整指南

    [:octicons-arrow-right-24: 阅读](thesis-bachelor-science.md)

- :material-earth:{ .lg .middle } **资源获取**

    ---

    网络资源、开源项目、数学学习

    [:octicons-arrow-right-24: 阅读](how-to-get-resources.md)

</div>

---

!!! abstract "📌 相关推荐"
    - [搜索引擎](../general-skills/search-platforms.md)
    - [工具推荐](../general-skills/tools.md)
    - [学生优惠](../general-skills/student-discounts.md)
```

- [ ] **Step 2: Rewrite general-skills/README.md**

Replace the entire file with:

```markdown
# 通识技能库

在校园与社会中，我们还需要掌握除了课本之外的许多知识。

<div class="grid cards" markdown>

- :material-magnify:{ .lg .middle } **搜索引擎**

    ---

    高效搜索技巧与资源获取

    [:octicons-arrow-right-24: 阅读](search-platforms.md)

- :material-tools:{ .lg .middle } **工具推荐**

    ---

    效率软件与实用工具

    [:octicons-arrow-right-24: 阅读](tools.md)

- :material-laptop:{ .lg .middle } **计算机基础**

    ---

    电脑操作、网络浏览、文件管理

    [:octicons-arrow-right-24: 阅读](computer-basic/SurfingTutorial.md)

- :material-school:{ .lg .middle } **考试与竞赛**

    ---

    考试准备、竞赛信息、认证考试

    [:octicons-arrow-right-24: 阅读](study/study.md)

- :material-tag:{ .lg .middle } **学生优惠**

    ---

    教育优惠、学生折扣汇总

    [:octicons-arrow-right-24: 阅读](student-discounts.md)

- :material-bank:{ .lg .middle } **银行与信用卡**

    ---

    大学生金融入门

    [:octicons-arrow-right-24: 阅读](bank-accounts-and-credit-cards.md)

</div>
```

- [ ] **Step 3: Create campus-life/README.md**

Create a new file with:

```markdown
# 校园生活

大学生活的方方面面，从入学到日常，从人际到保障。

<div class="grid cards" markdown>

- :material-account-multiple:{ .lg .middle } **人际关系**

    ---

    化解矛盾、社交关系、脱单技巧

    [:octicons-arrow-right-24: 阅读](resolving-conflicts.md)

- :material-home:{ .lg .middle } **生活技巧**

    ---

    图书馆、医保、国际交流、旅行健康

    [:octicons-arrow-right-24: 阅读](library.md)

- :material-hand-heart:{ .lg .middle } **圆梦帮扶**

    ---

    奖助学金、勤工俭学、助学贷款

    [:octicons-arrow-right-24: 阅读](scholarship.md)

- :material-school:{ .lg .middle } **入学准备**

    ---

    开学第0课、课程学分、转专业

    [:octicons-arrow-right-24: 阅读](first-lesson-of-school.md)

</div>

---

!!! abstract "📌 相关推荐"
    - [学生优惠](../general-skills/student-discounts.md)
    - [学术资源](../academic-resources/README.md)
    - [通识技能](../general-skills/README.md)
```

- [ ] **Step 4: Rewrite growth-path/README.md**

Replace the entire file with:

```markdown
# 成长通道

学业结束后的各种生涯路径参考与技能提升。

<div class="grid cards" markdown>

- :material-briefcase:{ .lg .middle } **就业准备**

    ---

    企业文化、求职技巧

    [:octicons-arrow-right-24: 阅读](../general-skills/recruit-exercitation.md)

- :material-lock:{ .lg .middle } **网络安全**

    ---

    密码管理、隐私保护

    [:octicons-arrow-right-24: 阅读](../general-skills/password_manage.md)

- :material-lightning-bolt:{ .lg .middle } **奇技淫巧**

    ---

    校园跑、刷课技巧

    [:octicons-arrow-right-24: 阅读](../general-skills/qi-ji-yin-qiao/campus-running.md)

- :material-brain:{ .lg .middle } **方法论**

    ---

    银行账户、金融入门

    [:octicons-arrow-right-24: 阅读](../general-skills/bank-accounts-and-credit-cards.md)

</div>
```

- [ ] **Step 5: Simplify community-hub/README.md**

Replace the entire file with:

```markdown
# 共建社区

Ac-Wiki 是一个由志愿者驱动的公益项目。每一份贡献都弥足珍贵。

<div class="grid cards" markdown>

- :material-account-group:{ .lg .middle } **关于我们**

    ---

    了解 Ac-Wiki 项目

    [:octicons-arrow-right-24: 阅读](about-wiki.md)

- :material-pencil:{ .lg .middle } **贡献指南**

    ---

    如何参与贡献

    [:octicons-arrow-right-24: 阅读](CONTRIBUTING.md)

- :material-email:{ .lg .middle } **联系我们**

    ---

    加入社区交流

    [:octicons-arrow-right-24: 阅读](contact-us.md)

</div>
```

- [ ] **Step 6: Verify all section pages render**

Run: `mkdocs serve` and visit each section index page.
Expected: Each page shows a grid of cards with icons, descriptions, and links. No broken links.

- [ ] **Step 7: Commit**

```bash
git add docs/academic-resources/README.md docs/general-skills/README.md docs/campus-life/README.md docs/growth-path/README.md docs/community-hub/README.md
git commit -m "feat: rewrite section index pages with grid cards layout"
```

---

### Task 5: Content Pages — Related Links Sidebar

**Files:**
- Modify: `docs/campus-life/first-lesson-of-school.md`
- Modify: `docs/campus-life/scholarship.md`
- Modify: `docs/campus-life/major-transfer-guide.md`
- Modify: `docs/general-skills/student-discounts.md`
- Modify: `docs/general-skills/tools.md`
- Modify: `docs/general-skills/search-platforms.md`
- Modify: `docs/general-skills/password_manage.md`
- Modify: `docs/academic-resources/academic-research-and-academic-writing.md`
- Modify: `docs/academic-resources/thesis-bachelor-science.md`

**Interfaces:**
- Consumes: CSS class `.related-links` from Task 1
- Produces: "Related links" blocks at top of key content pages

- [ ] **Step 1: Add related links to first-lesson-of-school.md**

Prepend the following block before the `# 开学第 0 课` heading:

```markdown
!!! abstract "📌 相关推荐"
    - [课程与学分](different-courses.md)
    - [转专业须知](major-transfer-guide.md)
    - [学生邮箱](student-email.md)
    - [学生优惠](../general-skills/student-discounts.md)

```

(Note: one blank line after the admonition block before the existing `#` heading)

- [ ] **Step 2: Add related links to scholarship.md**

Prepend before the existing content:

```markdown
!!! abstract "📌 相关推荐"
    - [勤工俭学](work-study-program.md)
    - [国家助学贷款](faq-national-student-loan.md)
    - [学生优惠](../general-skills/student-discounts.md)

```

- [ ] **Step 3: Add related links to major-transfer-guide.md**

Prepend before the existing content:

```markdown
!!! abstract "📌 相关推荐"
    - [课程与学分](different-courses.md)
    - [辅修/第二学位](minor-or-dual-degree.md)
    - [开学第0课](first-lesson-of-school.md)

```

- [ ] **Step 4: Add related links to student-discounts.md**

Prepend before the existing content:

```markdown
!!! abstract "📌 相关推荐"
    - [银行账户与信用卡](bank-accounts-and-credit-cards.md)
    - [工具推荐](tools.md)
    - [搜索引擎](search-platforms.md)

```

- [ ] **Step 5: Add related links to tools.md**

Prepend before the existing content:

```markdown
!!! abstract "📌 相关推荐"
    - [搜索引擎](search-platforms.md)
    - [计算机基础](computer-basic/SurfingTutorial.md)
    - [学生优惠](student-discounts.md)

```

- [ ] **Step 6: Add related links to search-platforms.md**

Prepend before the existing content:

```markdown
!!! abstract "📌 相关推荐"
    - [工具推荐](tools.md)
    - [计算机基础](computer-basic/SurfingTutorial.md)
    - [学术研究与写作](../academic-resources/academic-research-and-academic-writing.md)

```

- [ ] **Step 7: Add related links to password_manage.md**

Prepend before the existing content:

```markdown
!!! abstract "📌 相关推荐"
    - [隐私保护](cyber%20security/privacy.md)
    - [银行账户与信用卡](bank-accounts-and-credit-cards.md)

```

- [ ] **Step 8: Add related links to academic-research-and-academic-writing.md**

Prepend before the existing content:

```markdown
!!! abstract "📌 相关推荐"
    - [关键概念](some-key-concepts.md)
    - [毕业论文（理学）](thesis-bachelor-science.md)
    - [搜索引擎](../general-skills/search-platforms.md)

```

- [ ] **Step 9: Add related links to thesis-bachelor-science.md**

Prepend before the existing content:

```markdown
!!! abstract "📌 相关推荐"
    - [学术研究与写作](academic-research-and-academic-writing.md)
    - [关键概念](some-key-concepts.md)
    - [网络资源获取](how-to-get-resources.md)

```

- [ ] **Step 10: Verify admonition rendering**

Run: `mkdocs serve` and visit `campus-life/first-lesson-of-school.md`.
Expected: "📌 相关推荐" admonition block appears at top with styled links. Check dark mode too.

- [ ] **Step 11: Commit**

```bash
git add docs/campus-life/first-lesson-of-school.md docs/campus-life/scholarship.md docs/campus-life/major-transfer-guide.md docs/general-skills/student-discounts.md docs/general-skills/tools.md docs/general-skills/search-platforms.md docs/general-skills/password_manage.md docs/academic-resources/academic-research-and-academic-writing.md docs/academic-resources/thesis-bachelor-science.md
git commit -m "feat: add related links sidebar to key content pages"
```

---

### Task 6: Footer Links for Community Hub

**Files:**
- Modify: `mkdocs.yml` (extra section)
- Modify: `src/overrides/partials/copyright.html`

**Interfaces:**
- Consumes: Community hub pages (about-wiki.md, CONTRIBUTING.md, contact-us.md)
- Produces: Footer links to community content

- [ ] **Step 1: Add footer links to mkdocs.yml**

In the `extra:` section (after `analytics:` block, before `extra_css:`), add:

```yaml
    generator: false
```

Then add a `footer:` block inside `theme:` (after `palette:` block):

```yaml
    footer:
        - icon: material/account-group
          link: community-hub/about-wiki.md
          name: 关于 Wiki
        - icon: material/pencil
          link: community-hub/CONTRIBUTING.md
          name: 贡献指南
        - icon: material/email
          link: community-hub/contact-us.md
          name: 联系我们
```

Note: The `footer` goes under `theme:` section, not `extra:`. Material for MkDocs supports `theme.footer` links.

- [ ] **Step 2: Verify footer links appear**

Run: `mkdocs serve` and scroll to footer.
Expected: Footer shows "关于 Wiki", "贡献指南", "联系我们" links alongside existing social links.

- [ ] **Step 3: Commit**

```bash
git add mkdocs.yml
git commit -m "feat: add community hub links to site footer"
```

---

### Task 7: Final Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Full build with strict mode**

Run: `mkdocs build --strict 2>&1`
Expected: Build succeeds. Warnings about orphan pages (e.g., `choose-major.md`, `student-resources.md`, files not in nav) are expected and acceptable.

- [ ] **Step 2: Visual spot-check**

Run: `mkdocs serve` and check:

1. **Homepage**: Hero gradient visible, 4 feature cards, 4 nav cards, footer
2. **导航切换**: Each tab loads correctly, sections expand in sidebar
3. **Section pages**: Grid cards render with icons and hover effects
4. **Content page**: Related links admonition visible at top
5. **Dark mode**: Toggle and verify all elements look correct
6. **Mobile**: Resize browser to 375px width, verify cards stack vertically

- [ ] **Step 3: Final commit (if any fixups needed)**

```bash
git add -A
git commit -m "fix: visual adjustments from final verification"
```
