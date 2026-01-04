import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([])

  useEffect(() => {
    fetch('/posts.json')
      .then(res => res.json())
      .then(data => setFeaturedPosts(data.slice(0, 3)))
      .catch(err => console.error('Error loading posts:', err))
  }, [])

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Learn to Start, Grow & Market Your Business</h2>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Actionable guides and tips to take your business from idea to profit.
        </p>
        <Link to="/blog" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 inline-block">
          Read Latest Articles
        </Link>
      </section>

      <section className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Start a Business</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Step-by-step guides to launch your startup successfully.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Grow Your Business</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Learn strategies to scale and manage growth efficiently.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Earn Online</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Discover online marketing tactics to boost revenue.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredPosts.map(post => (
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
      </section>
    </>
  )
}
