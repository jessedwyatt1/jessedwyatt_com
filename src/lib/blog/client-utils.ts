interface BlogFrontmatter {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  project?: {
    name: string;
    github?: string;
    live?: string;
  };
}

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

  frontmatter.push('social:');
  frontmatter.push('  image: "/blog/default-blog.png"');
  frontmatter.push(`  title: "${data.title}"`);
  frontmatter.push(`  description: "${data.description}"`);

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

export async function parseUploadedFile(file: File): Promise<{
  frontmatter: BlogFrontmatter;
  content: string;
}> {
  const text = await file.text();
  
  // Check if the file has frontmatter
  const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (frontmatterMatch) {
    try {
      // Parse YAML frontmatter
      const frontmatterText = frontmatterMatch[1];
      const content = frontmatterMatch[2].trim();
      
      // Simple YAML parsing (you might want to use a proper YAML parser in production)
      const frontmatter: BlogFrontmatter = {};
      frontmatterText.split('\n').forEach(line => {
        const [key, ...values] = line.split(':');
        if (key && values.length) {
          let value = values.join(':').trim();
          
          // Handle arrays
          if (value.startsWith('[') && value.endsWith(']')) {
            if (key.trim() === 'tags') {
              frontmatter.tags = value.slice(1, -1).split(',').map(v => 
                v.trim().replace(/^["']|["']$/g, '')
              );
            }
          }
          // Handle quoted strings
          else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          
          if (key.trim() === 'project') {
            frontmatter.project = { name: value };
          } else if (!Array.isArray(value)) {
            // @ts-expect-error - We know these are valid keys from BlogFrontmatter
            frontmatter[key.trim()] = value;
          }
        }
      });
      
      return { frontmatter, content };
    } catch (error) {
      console.error('Error parsing frontmatter:', error);
      return { frontmatter: {}, content: text };
    }
  }
  
  // If no frontmatter, return the entire content
  return { frontmatter: {}, content: text };
} 