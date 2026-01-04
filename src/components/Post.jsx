import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function Post() {
  const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    fetch('/posts.json')
      .then(res => res.json())
      .then(data => {
        const foundPost = data.find(p => p.id === id)
        setPost(foundPost)
      })
      .catch(err => console.error('Error loading post:', err))
  }, [id])

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <main className="max-w-3xl mx-auto p-6">
        <Link to="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          ← Back to Blog
        </Link>
        <img src={post.image} alt={post.title} className="rounded-xl mb-6 w-full h-96 object-cover" />
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded inline-block mb-6">
          {post.category}
        </span>
        <article
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </main>
    </>
  )
}
