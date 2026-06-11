import type { CollectionEntry } from "astro:content";

export const getTags = (posts: CollectionEntry<"posts">[]): { name: string; count: number }[] => {
  const tagMap: Record<string, number> = {};

  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });

  return Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};
