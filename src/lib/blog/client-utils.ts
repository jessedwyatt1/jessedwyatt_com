export function separateMarkdownContent(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: '', content: content };
  return { frontmatter: match[1], content: match[2].trim() };
}

export function generateFrontmatter(data: {
  title: string;
  date: string;
  description: string;
  tags: string[];
  project?: {
    name: string;
    github?: string;
    live?: string;
  } | null;
}) {
  const frontmatter = [
    '---',
    `title: "${data.title}"`,
    `date: "${data.date}"`,
    `description: "${data.description}"`,
    `tags: [${data.tags.map(tag => `"${tag}"`).join(', ')}]`
  ];

  if (data.project) {
    frontmatter.push('project:');
    frontmatter.push(`  name: "${data.project.name}"`);
    if (data.project.github) frontmatter.push(`  github: "${data.project.github}"`);
    if (data.project.live) frontmatter.push(`  live: "${data.project.live}"`);
  }

  frontmatter.push('---\n');
  return frontmatter.join('\n');
}

export function generateSlug(title: string, date: string) {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  return `${year}/${month}/${slug}`;
} 