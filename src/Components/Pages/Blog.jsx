import React, { useState, useEffect } from "react";
import api, { BASE_URL } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

function Blog() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/api/blog?limit=100&published=true")
      .then((r) => setPosts(r.data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))];
  const recentPosts = posts.slice(0, 3);
  const fmt = (d) => new Date(d).toLocaleDateString("vi-VN");

  return (
    <>
      {/* Banner */}
      <div className="banner-section blog-banner-section flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-[#f5b754]">- Blog &amp; {t.blog?.bannerSub || "Tin tức"}</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-[#f5b754]">
            <span className="font-bricolage text-white">{t.blog?.bannerTitle1 || "Select"} </span>
            {t.blog?.bannerTitle2 || "Luxury Car"}
          </h1>
        </div>
      </div>

      <div className="bg-zinc-900 text-white min-h-screen sm:px-6 md:px-8 lg:px-[12%] xl:px-[12%] py-12">
        <div className="max-w-71 mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main posts */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f5b754]" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                {t.blog?.noPosts || "Chưa có bài viết"}
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  id={`post-${post._id}`}
                  className="mb-10 bg-zinc-800 rounded-xl overflow-hidden shadow-lg"
                >
                  {post.image && (
                    <img
                      src={`${BASE_URL}/uploads/${post.image}`}
                      alt={post.title}
                      className="w-full h-72 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className="text-sm text-gray-400">
                      {post.category} • {fmt(post.createdAt)}
                    </p>
                    <h2 className="text-2xl font-bold mt-2">{post.title}</h2>
                    <p className="text-sm text-gray-400 mt-2">by {post.author}</p>
                    {post.excerpt && <p className="text-gray-300 mt-3">{post.excerpt}</p>}
                    {post.content && (
                      <p className="text-gray-400 mt-3 whitespace-pre-line line-clamp-4">{post.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            <div className="bg-zinc-800 p-4 rounded-xl">
              <input
                type="text"
                placeholder={t.blog?.searchPlaceholder || "Tìm kiếm..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded bg-zinc-700 text-white focus:outline-none"
              />
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">{t.blog?.recentPosts || "Bài viết gần đây"}</h3>
              {recentPosts.length === 0 && <p className="text-sm text-gray-500">—</p>}
              {recentPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center mb-4 cursor-pointer"
                  onClick={() => {
                    document.getElementById(`post-${post._id}`)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {post.image && (
                    <img
                      src={`${BASE_URL}/uploads/${post.image}`}
                      alt={post.title}
                      className="w-14 h-14 object-cover rounded mr-3"
                    />
                  )}
                  <p className="text-sm">{post.title}</p>
                </div>
              ))}
            </div>

            {categories.length > 0 && (
              <div className="bg-zinc-800 p-4 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">{t.blog?.categories || "Danh mục"}</h3>
                <ul className="text-sm space-y-2">
                  {categories.map((category, idx) => (
                    <li key={idx} className="text-gray-300 hover:text-white cursor-pointer">
                      &rsaquo; {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {allTags.length > 0 && (
              <div className="bg-zinc-800 p-4 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">{t.blog?.tags || "Tags"}</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-zinc-700 px-3 py-1 rounded-full text-sm hover:bg-yellow-500 hover:text-black cursor-pointer transition"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
