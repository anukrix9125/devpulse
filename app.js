// Initial fallback resources state array
let resources = [
  { id: 1, title: "Tailwind CSS Documentation", category: "CSS / Design", description: "A utility-first CSS framework packed with classes that can be composed to build any design.", url: "https://tailwindcss.com", upvotes: 142 },
  { id: 2, title: "React Official Guide", category: "Frontend", description: "The library for web and native user interfaces. Build modular components with state.", url: "https://react.dev", upvotes: 310 },
  { id: 3, title: "Express.js Routing Guide", category: "Backend", description: "Fast, unopinionated, minimalist web framework for Node.js backend architecture.", url: "https://expressjs.com", upvotes: 95 }
];

// DOM Element Selectors
const resourcesGrid = document.getElementById("resources-grid");
const searchInput = document.getElementById("search-input");
const resourceCount = document.getElementById("resource-count");
const submitForm = document.getElementById("submit-form");

/**
 * Render resource cards into the DOM grid container
 * @param {Array} items - List of resource objects to render
 */
function renderResources(items) {
  resourcesGrid.innerHTML = "";

  if (items.length === 0) {
    resourcesGrid.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-500">
        <p class="text-base">No resources found matching your query.</p>
      </div>
    `;
    resourceCount.textContent = "0 resources";
    return;
  }

  // Update resource count badge
  resourceCount.textContent = `${items.length} resource${items.length === 1 ? '' : 's'}`;

  // Map and inject HTML markup for each resource card
  items.forEach((resource, index) => {
    const article = document.createElement("article");
    article.className = "bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all";
    
    article.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <span>${resource.category}</span>
          <span class="text-slate-500 font-normal">#${index + 1}</span>
        </div>
        <h3 class="text-lg font-bold text-white line-clamp-2">${resource.title}</h3>
        <p class="text-sm text-slate-400 line-clamp-3">
          ${resource.description}
        </p>
      </div>
      <footer class="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm">
        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 font-medium hover:underline">
          Read Article &rarr;
        </a>
        <button type="button" data-id="${resource.id || index}" class="upvote-btn flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">
          <span>▲</span> <span class="font-semibold">${resource.upvotes}</span>
        </button>
      </footer>
    `;

    resourcesGrid.appendChild(article);
  });

  attachUpvoteListeners();
}

/**
 * Asynchronously fetch live developer articles from the DEV.to public API
 */
async function fetchDevArticles() {
  try {
    resourceCount.textContent = "Fetching live articles...";
    
    const response = await fetch("https://dev.to/api/articles?per_page=6&tag=javascript");
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Map DEV.to API response structure to match our DevPulse resource schema
    const liveArticles = data.map(article => ({
      id: article.id,
      title: article.title,
      category: article.tags && article.tags.length > 0 ? article.tags[0].toUpperCase() : "DEV COMMUNITY",
      description: article.description || "Read technical insights and documentation on DEV.to.",
      url: article.url,
      upvotes: article.public_reactions_count || Math.floor(Math.random() * 50) + 10
    }));

    // Merge live articles with initial resources array
    resources = [...liveArticles, ...resources];
    renderResources(resources);

  } catch (error) {
    console.error("Failed to fetch external articles:", error);
    resourceCount.textContent = "Loaded local fallback cache";
    renderResources(resources);
  }
}

/**
 * Handle real-time search filtering based on input value
 */
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  
  const filtered = resources.filter(res => 
    res.title.toLowerCase().includes(query) || 
    res.category.toLowerCase().includes(query) ||
    res.description.toLowerCase().includes(query)
  );

  renderResources(filtered);
});

/**
 * Handle client-side resource submission form
 */
submitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleInput = document.getElementById("title");
  const urlInput = document.getElementById("url");
  const categorySelect = document.getElementById("category");

  const newResource = {
    id: Date.now(),
    title: titleInput.value.trim(),
    url: urlInput.value.trim(),
    category: categorySelect.value,
    description: "Newly submitted community resource item.",
    upvotes: 1
  };

  resources.unshift(newResource);
  renderResources(resources);
  submitForm.reset();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/**
 * Attach click listeners to upvote buttons for interactive state updates
 */
function attachUpvoteListeners() {
  const upvoteButtons = document.querySelectorAll(".upvote-btn");
  upvoteButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const targetResource = resources.find(r => r.id == id);
      if (targetResource) {
        targetResource.upvotes += 1;
        renderResources(resources);
      }
    });
  });
}

// Initialize application on script load by fetching external API data
fetchDevArticles();
