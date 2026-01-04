import { Link } from 'react-router-dom'

export default function Header({ theme, onThemeToggle }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-blue-700 dark:text-blue-300">
          BizGrowth Blog
        </Link>
        <div className="flex items-center gap-4">
          <nav className="space-x-4 flex items-center">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
              Blog
            </Link>
            <a href="#about" className="hover:text-blue-600 dark:hover:text-blue-400">
              About
            </a>
          </nav>
          <button
            onClick={onThemeToggle}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {theme === 'dark' ? '☀️' : '🌙'} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  )
}
