let allPosts = [];
let displayedPosts = 0;
const POSTS_PER_PAGE = 6;

async function initBlogPage() {
  try {
    const res = await fetch("posts.json");
    allPosts = await res.json();

    displayedPosts = 0; // reset counter
    renderPostsWithPagination();

    // Populate categories dynamically
    populateCategories();

    // Attach search + filter listeners
    document.getElementById("search-input").addEventListener("input", () => {
      displayedPosts = 0;
      renderPostsWithPagination();
    });

    document.getElementById("category-filter").addEventListener("change", () => {
      displayedPosts = 0;
      renderPostsWithPagination();
    });

    // Load more button
    document.getElementById("load-more-btn").addEventListener("click", () => {
      displayedPosts += POSTS_PER_PAGE;
      renderPostsWithPagination();
    });
  } catch (err) {
    console.error("Error loading blog page:", err);
  }
}

// Render posts with pagination
function renderPostsWithPagination() {
  const container = document.getElementById("all-posts");

  const searchQuery = document.getElementById("search-input")?.value.toLowerCase() || "";
  const selectedCategory = document.getElementById("category-filter")?.value || "";

  // Filter posts
  let filtered = allPosts.filter((post) => {
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Paginate results
  const visiblePosts = filtered.slice(0, displayedPosts + POSTS_PER_PAGE);
  renderPosts(visiblePosts, container);

  // Show/Hide Load More button
  const loadMoreBtn = document.getElementById("load-more-btn");
  if (visiblePosts.length < filtered.length) {
    loadMoreBtn.classList.remove("hidden");
  } else {
    loadMoreBtn.classList.add("hidden");
  }
}

// Helper to render posts (unchanged)
function renderPosts(posts, container) {
  if (!posts.length) {
    container.innerHTML = `<p class="text-gray-500 text-center col-span-3">No posts found.</p>`;
    return;
  }

  container.innerHTML = posts
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
    .join("");
}

// Populate categories dynamically (unchanged)
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

