import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog/utils';
import { BlogPosts } from '@/components/blog/posts';
import { BlogPostMeta } from '@/lib/blog/types';

const POSTS_PER_PAGE = 5;

// Month names for archive navigation
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface GroupedPosts {
  [year: string]: {
    [month: string]: BlogPostMeta[];
  };
}

export const revalidate = 3600;

export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  
  // Group posts by year and month for archive
  const groupedPosts = allPosts.reduce<GroupedPosts>((acc, post) => {
    const date = new Date(post.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    
    acc[year][month].push(post);
    return acc;
  }, {});
  
  return (
    <div className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts Grid */}
          <div className="flex-1">
            <BlogPosts initialPosts={allPosts.slice(0, POSTS_PER_PAGE)} totalPosts={allPosts} />
          </div>

          {/* Archive Navigation */}
          <div className="lg:w-24 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Archive</h2>
            {Object.entries(groupedPosts)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, months]) => (
                <div key={year} className="space-y-2">
                  <h3 className="font-medium text-blue-400">{year}</h3>
                  <ul className="space-y-1 pl-4">
                    {Object.entries(months)
                      .sort(([a], [b]) => Number(b) - Number(a))
                      .map(([month]) => (
                        <li key={month}>
                          <Link 
                            href={`/blog/archive/${year}/${month}`}
                            className="text-muted-foreground hover:text-blue-400 transition-colors"
                          >
                            {monthNames[Number(month) - 1]}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 