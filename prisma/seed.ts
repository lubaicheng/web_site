import "dotenv/config";
import { createClient } from "@libsql/client";
import path from "path";

const dbUrl = process.env.DATABASE_URL || `file:${path.join(process.cwd(), "dev.db")}`;
const db = createClient({ url: dbUrl });

function svgDataUri(option: { w: number; h: number; bg: string; fg: string; text: string }): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${option.w}" height="${option.h}">
    <rect fill="${option.bg}" width="${option.w}" height="${option.h}"/>
    <text fill="${option.fg}" font-size="${Math.min(option.w, option.h) / 12}" font-family="Arial,sans-serif"
      x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">${option.text}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

async function main() {
  console.log("Seeding database...");
  const now = "datetime('now')";

  // 1. Site Config
  await db.execute(`INSERT INTO SiteConfig (copyrightZh, copyrightEn, addressZh, addressEn, email, phone, mapImageUrl, mapLink, siteNameZh, siteNameEn, homeLeftNewsCount, homeRightNewsCount, carouselInterval)
    VALUES ('Copyright © 2026 Jin教授课题组 版权所有', 'Copyright © 2026 Prof. Jin''s Research Group. All rights reserved.',
    '安徽省芜湖市九华南路189号 安徽师范大学生命科学学院', 'College of Life Sciences, Anhui Normal University, 189 South Jiuhua Road, Wuhu, Anhui, China',
    'jin@ahnu.edu.cn', '+86-553-3869XXX', '${svgDataUri({w:600,h:300,bg:"#E8F0FE",fg:"#1a56db",text:"Map Placeholder"})}', 'https://map.baidu.com',
    '金教授课题组', 'Jin''s Research Group', 3, 7, 4)`);
  console.log("  ✓ Site config created");

  // 2. Carousel Images (1200x500)
  const carouselColors = [
    { bg: "#E8F0FE", fg: "#1a56db", text: "Group Photo 1" },
    { bg: "#FEF3C7", fg: "#92400e", text: "Group Photo 2" },
    { bg: "#D1FAE5", fg: "#065f46", text: "Group Photo 3" },
    { bg: "#FCE7F3", fg: "#9d174d", text: "Group Photo 4" },
  ];
  for (let i = 0; i < carouselColors.length; i++) {
    const c = carouselColors[i];
    await db.execute({
      sql: `INSERT INTO CarouselImage (imageUrl, "order", createdAt, updatedAt) VALUES (?, ?, ${now}, ${now})`,
      args: [svgDataUri({ w: 1200, h: 500, bg: c.bg, fg: c.fg, text: c.text }), i + 1],
    });
  }
  console.log("  ✓ 4 carousel images created");

  // 3. News
  const newsItems = [
    { titleZh: "课题组在Nature Communications发表重要研究成果", titleEn: "Research Group Publishes Important Results in Nature Communications", slug: "nature-communications-2025", coverColor: "#DBEAFE", coverFg: "#1e40af", coverText: "Nature Comm", daysAgo: 10,
      contentZh: "<p>近日，课题组在<em>Nature Communications</em>上发表了题为\"XXXX\"的研究论文。该研究揭示了XXXX的重要机制，为XXXX提供了新的思路。</p><p>本研究得到了国家自然科学基金（项目号：XXXXXX）的资助。</p>",
      contentEn: "<p>Our research group recently published a paper titled \"XXXX\" in <em>Nature Communications</em>. This study reveals important mechanisms, providing new insights.</p><p>This work was supported by the National Natural Science Foundation of China.</p>" },
    { titleZh: "课题组参加2025年全国生物化学与分子生物学学术大会", titleEn: "Group Attends 2025 National Conference", slug: "conference-2025", coverColor: "#FEF3C7", coverFg: "#92400e", coverText: "Conference", daysAgo: 30,
      contentZh: "<p>2025年10月，课题组全体成员参加了在南京举办的全国生物化学与分子生物学学术大会。会上，课题组成员共展示了3份海报，并做了2场口头报告。</p>",
      contentEn: "<p>In October 2025, all group members attended the National Conference on Biochemistry and Molecular Biology held in Nanjing. Members presented 3 posters and gave 2 oral presentations.</p>" },
    { titleZh: "欢迎新同学加入课题组", titleEn: "Welcome New Members to the Group", slug: "welcome-new-members-2025", coverColor: "#D1FAE5", coverFg: "#065f46", coverText: "Welcome", daysAgo: 60,
      contentZh: "<p>2025年秋季，课题组迎来了3名新硕士研究生和1名新博士研究生。他们将分别从事XXXX和XXXX方向的研究工作。</p>",
      contentEn: "<p>In Fall 2025, the group welcomed 3 new master's students and 1 new doctoral student.</p>" },
    { titleZh: "课题组论文被Cell Reports接收", titleEn: "Group Paper Accepted by Cell Reports", slug: "cell-reports-2025", coverColor: "#F3E8FF", coverFg: "#6b21a8", coverText: "Cell Reports", daysAgo: 90,
      contentZh: "<p>课题组关于XXXX的研究论文已被<em>Cell Reports</em>正式接收，即将在线发表。</p>",
      contentEn: "<p>Our paper has been accepted by <em>Cell Reports</em> and will be published online soon.</p>" },
    { titleZh: "金教授受邀在复旦大学做学术报告", titleEn: "Prof. Jin Invited to Give Talk at Fudan University", slug: "fudan-talk-2025", coverColor: "#E0E7FF", coverFg: "#3730a3", coverText: "Fudan Talk", daysAgo: 120,
      contentZh: "<p>2025年7月，金教授应邀在复旦大学生命科学学院做了题为\"XXXX\"的学术报告。</p>",
      contentEn: "<p>In July 2025, Prof. Jin was invited to give a talk at Fudan University.</p>" },
    { titleZh: "课题组获得国家自然科学基金面上项目资助", titleEn: "Group Awarded NSFC General Project Grant", slug: "nsfc-grant-2025", coverColor: "#FEE2E2", coverFg: "#991b1b", coverText: "NSFC Grant", daysAgo: 150,
      contentZh: "<p>课题组申请的\"XXXX\"项目获得国家自然科学基金面上项目资助。</p>",
      contentEn: "<p>The group's project has been awarded the NSFC General Program grant.</p>" },
  ];

  for (const item of newsItems) {
    const coverUrl = svgDataUri({ w: 400, h: 300, bg: item.coverColor, fg: item.coverFg, text: item.coverText });
    await db.execute({
      sql: `INSERT INTO News (titleZh, titleEn, contentZh, contentEn, slug, coverImage, publishedAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?), ${now}, ${now})`,
      args: [item.titleZh, item.titleEn, item.contentZh, item.contentEn, item.slug, coverUrl, `-${item.daysAgo} days`],
    });
  }
  console.log(`  ✓ ${newsItems.length} news items created`);

  // 4. Team Members
  const members = [
    { nameZh: "金教授", nameEn: "Prof. Jin", titleZh: "教授 / 博士生导师", titleEn: "Professor / PhD Supervisor", group: "supervisor", order: 1, email: "jin@ahnu.edu.cn", office: "生命科学学院 A201", phone: "0553-3869XXX", slug: "prof-jin",
      photoBg: "#E8F0FE", photoFg: "#1a56db", photoText: "Prof Jin",
      bioZh: "金教授，博士生导师，主要从事蛋白质结构与功能、细胞信号转导等领域的研究。在 Nature、Cell 等国际顶级期刊发表论文多篇。", bioEn: "Prof. Jin is a PhD supervisor working on protein structure and cell signaling. He has published in top journals such as Nature and Cell." },
    { nameZh: "李副教授", nameEn: "Prof. Li", titleZh: "副教授 / 硕士生导师", titleEn: "Associate Professor / Master Supervisor", group: "supervisor", order: 2, email: "li@ahnu.edu.cn", slug: "prof-li",
      photoBg: "#DBEAFE", photoFg: "#1e40af", photoText: "Prof Li",
      bioZh: "李副教授，主要从事基因编辑与基因治疗方向的研究。", bioEn: "Prof. Li works on gene editing and gene therapy." },
    { nameZh: "王博士", nameEn: "Dr. Wang", titleZh: "博士后", titleEn: "Postdoctoral Fellow", group: "postdoc", order: 1, email: "wang@ahnu.edu.cn", slug: "dr-wang",
      photoBg: "#FEF3C7", photoFg: "#92400e", photoText: "Dr Wang",
      bioZh: "王博士于2024年获得博士学位，目前从事蛋白质结构功能研究。", bioEn: "Dr. Wang received his PhD in 2024 and is working on protein structure-function studies." },
    { nameZh: "张三", nameEn: "San Zhang", titleZh: "博士研究生（2023级）", titleEn: "PhD Student (2023-)", group: "student", order: 1, slug: "san-zhang",
      photoBg: "#D1FAE5", photoFg: "#065f46", photoText: "S Zhang" },
    { nameZh: "李四", nameEn: "Si Li", titleZh: "硕士研究生（2024级）", titleEn: "Master Student (2024-)", group: "student", order: 2, slug: "si-li",
      photoBg: "#FCE7F3", photoFg: "#9d174d", photoText: "S Li" },
    { nameZh: "赵六", nameEn: "Liu Zhao", titleZh: "硕士研究生（2025级）", titleEn: "Master Student (2025-)", group: "student", order: 3, slug: "liu-zhao",
      photoBg: "#E0E7FF", photoFg: "#3730a3", photoText: "L Zhao" },
    { nameZh: "前毕业生A", nameEn: "Alumni A", titleZh: "博士（2023届）", titleEn: "PhD (2023)", group: "alumni", order: 1, slug: "alumni-a",
      photoBg: "#F3E8FF", photoFg: "#6b21a8", photoText: "Alumni A" },
  ];

  for (const m of members) {
    const photoUrl = svgDataUri({ w: 400, h: 500, bg: m.photoBg || "#f3f4f6", fg: m.photoFg || "#6b7280", text: m.photoText || m.nameEn });
    await db.execute({
      sql: `INSERT INTO TeamMember (nameZh, nameEn, titleZh, titleEn, photo, "group", "order", email, office, phone, slug, bioZh, bioEn, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${now}, ${now})`,
      args: [m.nameZh, m.nameEn, m.titleZh || "", m.titleEn || "", photoUrl, m.group, m.order, m.email || "", (m as any).office || "", (m as any).phone || "", m.slug, (m as any).bioZh || "", (m as any).bioEn || ""],
    });
  }
  console.log(`  ✓ ${members.length} team members created`);

  // 5. Publications
  const pubs = [
    { title: "Molecular mechanism of cellular signaling", authors: "Jin X, Zhang S, et al.", journal: "Nature Communications", year: 2025, doi: "10.1038/s41467-025-XXXXX" },
    { title: "Structural basis of receptor recognition", authors: "Li W, Wang Y, Jin X*", journal: "Cell Reports", year: 2025, doi: "10.1016/j.celrep.2025.XXXXX" },
    { title: "A novel approach to study protein interactions", authors: "Zhang S, Li W, Jin X*", journal: "Journal of Biological Chemistry", year: 2024, doi: "10.1016/j.jbc.2024.XXXXX" },
    { title: "Functional analysis of gene A in development", authors: "Wang Y, Jin X*", journal: "Development", year: 2024, doi: "10.1242/dev.XXXXX" },
    { title: "Crystal structure of enzyme B", authors: "Jin X, Johnson M", journal: "Nature Structural & Molecular Biology", year: 2023, doi: "10.1038/s41594-023-XXXXX" },
    { title: "Role of microRNA in cell differentiation", authors: "Li W, Jin X*", journal: "Nucleic Acids Research", year: 2023, doi: "10.1093/nar/gkadXXX" },
    { title: "Novel biomarkers for disease diagnosis", authors: "Zhang S, Jin X*", journal: "Nature Communications", year: 2022, doi: "10.1038/s41467-022-XXXXX" },
  ];

  for (const p of pubs) {
    await db.execute({
      sql: `INSERT INTO Publication (title, authors, journal, year, doi, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ${now}, ${now})`,
      args: [p.title, p.authors, p.journal, p.year, p.doi],
    });
  }
  console.log(`  ✓ ${pubs.length} publications created`);

  // 6. Research Areas
  const areas = [
    { titleZh: "蛋白质结构与功能", titleEn: "Protein Structure and Function",
      descZh: "<p>利用<strong>X射线晶体学</strong>、<strong>冷冻电镜</strong>等技术研究重要蛋白质的三维结构及其功能机制。</p><p>主要研究方向包括：</p><ul><li>膜蛋白的结构解析</li><li>蛋白质-蛋白质相互作用的结构基础</li><li>基于结构的药物设计</li></ul>",
      descEn: "<p>Using <strong>X-ray crystallography</strong> and <strong>cryo-EM</strong> to study protein structures.</p>",
      slug: "protein-structure", order: 1 },
    { titleZh: "细胞信号转导", titleEn: "Cell Signaling",
      descZh: "<p>研究细胞内外信号转导的分子机制，重点探索与疾病相关的信号通路。</p><ol><li><strong>受体激活机制</strong> — 研究细胞表面受体的配体识别与激活过程</li><li><strong>下游信号网络</strong> — 解析信号通路中的关键节点</li></ol>",
      descEn: "<p>Studying the molecular mechanisms of cell signaling.</p>",
      slug: "cell-signaling", order: 2 },
    { titleZh: "基因编辑与基因治疗", titleEn: "Gene Editing and Gene Therapy",
      descZh: "<p>开发新型<strong>基因编辑工具</strong>，探索其在遗传性疾病治疗中的应用。</p><ul><li>CRISPR-Cas9 优化系统</li><li>碱基编辑器</li><li>先导编辑器</li></ul>",
      descEn: "<p>Developing novel gene editing tools.</p>",
      slug: "gene-editing", order: 3 },
  ];

  for (const a of areas) {
    await db.execute({
      sql: `INSERT INTO ResearchArea (titleZh, titleEn, descriptionZh, descriptionEn, slug, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ${now}, ${now})`,
      args: [a.titleZh, a.titleEn, a.descZh, a.descEn, a.slug, a.order],
    });
  }
  console.log(`  ✓ ${areas.length} research areas created`);

  // 7. Friendly Links
  const links = [
    { name: "科学技术部", url: "https://www.most.gov.cn/", bg: "#E8F0FE", fg: "#1a56db", text: "MOST", order: 1 },
    { name: "国家自然科学基金委员会", url: "https://www.nsfc.gov.cn/", bg: "#DBEAFE", fg: "#1e40af", text: "NSFC", order: 2 },
    { name: "安徽师范大学", url: "https://www.ahnu.edu.cn/", bg: "#FEF3C7", fg: "#92400e", text: "AHNU", order: 3 },
    { name: "生命科学学院", url: "https://biology.ahnu.edu.cn/", bg: "#D1FAE5", fg: "#065f46", text: "Biology", order: 4 },
  ];

  for (const l of links) {
    const imgUrl = svgDataUri({ w: 200, h: 80, bg: l.bg, fg: l.fg, text: l.text });
    await db.execute({
      sql: `INSERT INTO FriendlyLink (name, url, imageUrl, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ${now}, ${now})`,
      args: [l.name, l.url, imgUrl, l.order],
    });
  }
  console.log(`  ✓ ${links.length} friendly links created`);

  // 8. Member Sections for Prof. Jin (id=1)
  const sectionData = [
    { title: "研究方向", content: "<ol><li><strong>污染控制化学</strong></li><li><strong>光/电催化</strong></li><li><strong>纳米环境材料</strong></li></ol>" },
    { title: "个人简历", content: "<p>1973年2月出生。上海交通大学环境科学与工程学院特聘教授。</p><p>已获授权专利 30 余项。在 Nature Sustainability、Nature Communications、Chem、PNAS、JACS、Angew. Chem. Int. Ed. 等国际学术期刊发表论文 390 篇，其中34篇入选 ESI 高被引论文，1篇入选ESI热点论文。论文已被引用 44200 多次，其中他引 42980 多次，H 因子 116。</p>" },
    { title: "教育背景", content: "<ul><li><strong>1991-1995</strong>：中国地质大学应用化学系，工学学士。</li><li><strong>1995-1998</strong>：华中科技大学化学系，工学硕士。</li><li><strong>2000-2003</strong>：香港中文大学环境科学系，哲学博士。</li></ul>" },
    { title: "荣誉奖项", content: "<ul><li>德国洪堡奖学金（2006）</li><li>湖北省自然科学二等奖（第一完成人）（2008）</li><li>Elsevier 中国高被引学者（2014起）</li><li>Clarivate（Web of Science）全球高被引科学家（2018 起）</li><li>湖北省自然科学一等奖（第一完成人）（2019）</li></ul>" },
  ];

  for (let i = 0; i < sectionData.length; i++) {
    await db.execute({
      sql: `INSERT INTO MemberSection (memberId, title, content, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ${now}, ${now})`,
      args: [1, sectionData[i].title, sectionData[i].content, i],
    });
  }
  console.log(`  ✓ ${sectionData.length} sections created for Prof. Jin`);

  console.log("\n✅ Database seeding completed!");
}

main().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
