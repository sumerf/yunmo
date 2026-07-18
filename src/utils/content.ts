import { getCollection, type CollectionEntry } from "astro:content";

export const POSTS_PAGE_SIZE = 5;
export const TAG_POSTS_PAGE_SIZE = 1;

export type PostEntry = CollectionEntry<"posts">;

export const getAllPosts = async () =>
  (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

export const getAllTags = (posts: PostEntry[]) =>
  [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));

export const getPostsByTag = (posts: PostEntry[], tag: string) =>
  posts.filter((post) => post.data.tags.includes(tag));
