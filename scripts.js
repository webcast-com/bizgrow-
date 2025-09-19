let allPosts = [];

async function loadPosts(targetId, featuredOnly = false) {
  try {
    const res = await fetch("posts.json");
    const posts = await res.json();
    allPosts = posts; // store for search/filter use later

    const container = document.getElementById(targetId);
    if (!container) return;

    let filteredPosts = featuredOnly ? posts.slice(0, 3) : posts;
    renderPosts(filteredPosts, container);
  } catch (err) {
    console.error("Error loading posts:", err);
  }
}

// Helper: Render posts in a container
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

// Blog Page Initialization
async function initBlogPage() {
  try {
    const res = await fetch("posts.json");
    allPosts = await res.json();

    const container = document.getElementById("all-posts");
    renderPosts(allPosts, container);

    // Populate categories dynamically
    populateCategories();

    // Attach event listeners
    document.getElementById("search-input").addEventListener("input", filterPosts);
    document.getElementById("category-filter").addEventListener("change", filterPosts);
  } catch (err) {
    console.error("Error loading blog page:", err);
  }
}

// Populate dropdown with unique categories
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

// Filter posts by search text & category
function filterPosts() {
  const searchQuery = document.getElementById("search-input").value.toLowerCase();
  const selectedCategory = document.getElementById("category-filter").value;

  const filtered = allPosts.filter((post) => {
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  renderPosts(filtered, document.getElementById("all-posts"));
}

// Load single post by ID (unchanged)
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
