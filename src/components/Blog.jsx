import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const POSTS_PER_PAGE = 6

export default function Blog() {
  const [allPosts, setAllPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [displayedCount, setDisplayedCount] = useState(POSTS_PER_PAGE)

  useEffect(() => {
    fetch('/posts.json')
      .then(res => res.json())
      .then(data => {
        setAllPosts(data)
        const uniqueCategories = [...new Set(data.map(p => p.category))]
        setCategories(uniqueCategories)
      })
      .catch(err => console.error('Error loading posts:', err))
  }, [])

  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const visiblePosts = filteredPosts.slice(0, displayedCount)
  const hasMore = visiblePosts.length < filteredPosts.length

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setDisplayedCount(POSTS_PER_PAGE)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
    setDisplayedCount(POSTS_PER_PAGE)
  }

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + POSTS_PER_PAGE)
  }

  return (
    <>
      <section className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg px-4 py-2 w-full md:w-1/2"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </section>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">All Blog Posts</h1>

        {visiblePosts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">No posts found.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {visiblePosts.map(post => (
                <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
                  <img src={post.image} alt={post.title} className="rounded-t-xl h-48 object-cover w-full" />
                  <div className="p-4">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <h3 className="font-semibold text-lg mt-2 mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{post.excerpt}</p>
                    <Link to={`/post/${post.id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
