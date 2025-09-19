// Theme Initialization
document.addEventListener("DOMContentLoaded", () => {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
});

// Dark Mode Toggle Button
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });

  // Update button text based on saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    themeToggle.textContent = "☀️ Light Mode";
  }
}

let allPosts = [];
let displayedPosts = 0;
const POSTS_PER_PAGE = 6;
let isLoading = false;

async function initBlogPage() {
  try {
    const res = await fetch("posts.json");
    allPosts = await res.json();

    displayedPosts = 0;
    renderPostsWithPagination();

    populateCategories();

    document.getElementById("search-input").addEventListener("input", resetAndRender);
    document.getElementById("category-filter").addEventListener("change", resetAndRender);

    // Infinite scroll listener
    window.addEventListener("scroll", handleInfiniteScroll);
  } catch (err) {
    console.error("Error loading blog page:", err);
  }
}

function resetAndRender() {
  displayedPosts = 0;
  document.getElementById("all-posts").innerHTML = ""; // clear old posts
  renderPostsWithPagination();
}

function handleInfiniteScroll() {
  if (isLoading) return;

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    // Close to bottom
    displayedPosts += POSTS_PER_PAGE;
    renderPostsWithPagination();
  }
}

function renderPostsWithPagination() {
  const container = document.getElementById("all-posts");
  const loadingText = document.getElementById("loading-text");

  const searchQuery = document.getElementById("search-input")?.value.toLowerCase() || "";
  const selectedCategory = document.getElementById("category-filter")?.value || "";

  let filtered = allPosts.filter((post) => {
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const nextBatch = filtered.slice(displayedPosts, displayedPosts + POSTS_PER_PAGE);

  if (nextBatch.length === 0 && displayedPosts === 0) {
    container.innerHTML = `<p class="text-gray-500 text-center col-span-3">No posts found.</p>`;
    return;
  }

  if (nextBatch.length === 0) return; // No more posts to load

  isLoading = true;
  loadingText.classList.remove("hidden");

  setTimeout(() => {
    // Simulate loading delay
    container.insertAdjacentHTML(
      "beforeend",
      nextBatch
        .map(
          (post) => `
        <article class="bg-white rounded-xl shadow hover:shadow-lg transition">
          <img src="${post.image}" alt="${post.title}" class="rounded-t-xl">
          <div class="p-4">
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">${post.category}</span>
            <h3 class="font-semibold text-lg mt-2 mb-2">${post.title}</h3>
            <p class="text-gray-600 text-sm mb-4">${post.excerpt}</p>
            <a href="post.html?id=${post.id}" class="text-blue-600 font-medium">Read More →</a>
          </div>
        </article>
      `
        )
        .join("")
    );

    displayedPosts += POSTS_PER_PAGE;
    isLoading = false;
    loadingText.classList.add("hidden");
  }, 500);
}

function populateCategories() {
  const select = document.getElementById("category-filter");
  const categories = [...new Set(allPosts.map((p) => p.category))];

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Single post loader (unchanged)
async function loadSinglePost() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");
  if (!postId) return;

  try {
    const res = await fetch("posts.json");
    const posts = await res.json();
    const post = posts.find((p) => p.id === postId);

    if (post) {
      document.getElementById("post-title").textContent = post.title;
      document.getElementById("post-content").innerHTML = post.content;
      document.getElementById("post-image").src = post.image;
    }
  } catch (err) {
    console.error("Error loading post:", err);
  }
}
// Back to Top Button Logic
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.remove("hidden");
  } else {
    backToTopBtn.classList.add("hidden");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

