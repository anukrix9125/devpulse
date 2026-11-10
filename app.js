// Application State Management
let localResources = [
  { id: 1, title: "Tailwind CSS Documentation", category: "CSS / Design", description: "A utility-first CSS framework packed with classes that can be composed to build any design.", url: "https://tailwindcss.com", upvotes: 142 },
  { id: 2, title: "React Official Guide", category: "Frontend", description: "The library for web and native user interfaces. Build modular components with state.", url: "https://react.dev", upvotes: 310 },
  { id: 3, title: "Express.js Routing Guide", category: "Backend", description: "Fast, unopinionated, minimalist web framework for Node.js backend architecture.", url: "https://expressjs.com", upvotes: 95 },
  { id: 4, title: "MongoDB Mongoose Docs", category: "Database", description: "Elegant mongodb object modeling for node.js with schema validation.", url: "https://mongoosejs.com", upvotes: 215 },
  { id: 5, title: "MDN Web Docs JavaScript", category: "Frontend", description: "Resources for developers, by developers. Comprehensive JavaScript reference guides.", url: "https://developer.mozilla.org", upvotes: 420 }
];

let liveApiResources = [];
let isShowingLiveFeed = false;
let currentSearchQuery = "";

// DOM Element Selectors
const resourcesGrid = document.getElementById("resources-grid");
const searchInput = document.getElementById("search-input");
const resourceCount = document.getElementById("resource-count");
const submitForm = document.getElementById("submit-form");
const toggleFeedBtn = document.getElementById("toggle-feed-btn");
const feedTitle = document.getElementById("feed-title");

/**
 * Fetch live articles from DEV.to API with error handling and loading indicators
 */
async function fetchLiveResources() {
  resourcesGrid.innerHTML = `
    <div class="col-span-full text-center py-16 text-slate-400 space-y-3">
      <div class="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm font-medium">Fetching live articles from DEV.to API...</p>
    </div>
  `;
  resourceCount.textContent = "Connecting...";

  try {
    const response = await fetch("https://dev.to/api/articles?per_page=9");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    liveApiResources = data.map((article, index) => ({
      id: `live-${index + 1}`,
      title: article.title,
      category: article.tag_list && article.tag_list.length > 0 ? article.tag_list[0].toUpperCase() : "COMMUNITY",
      description: article.description || "No article description provided.",
      url: article.url,
      upvotes: article.public_reactions_count || Math.floor(Math.random() * 50) + 10
    }));

    feedTitle.textContent = "Live DEV.to Articles Feed";
    toggleFeedBtn.textContent = "Switch to Local Resources";
    isShowingLiveFeed = true;
    
    renderResources(liveApiResources);

  } catch (error) {
    resourcesGrid.innerHTML = `
      <div class="col-span-full text-center py-12 bg-red-950/20 border border-red-900/50 rounded-2xl p-6 text-red-400 space-y-2">
        <p class="font-semibold">Failed to load live developer feed.</p>
        <p class="text-xs text-red-500">${error.message}. Please check your network connection.</p>
        <button onclick="switchToLocalFeed()" class="mt-4 bg-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors">
          Return to Local Resources
        </button>
      </div>
    `;
    resourceCount.textContent = "Error";
  }
}

/**
 * Switch back to local hardcoded/submitted resources view
 */
window.switchToLocalFeed = function() {
  isShowingLiveFeed = false;
  feedTitle.textContent = "Featured Resources";
  toggleFeedBtn.textContent = "Switch to Live DEV.to Feed";
  renderResources(localResources);
}

/**
 * Render resource cards into the DOM grid container
 * @param {Array} items - List of resource objects to render
 */
function renderResources(items) {
  resourcesGrid.innerHTML = "";

  const filtered = items.filter(res => 
    res.title.toLowerCase().includes(currentSearchQuery) || 
    res.category.toLowerCase().includes(currentSearchQuery) ||
    res.description.toLowerCase().includes(currentSearchQuery)
  );

  if (filtered.length === 0) {
    resourcesGrid.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-500">
        <p class="text-base">No resources found matching your search.</p>
      </div>
    `;
    resourceCount.textContent = "0 resources";
    return;
  }

  resourceCount.textContent = `${filtered.length} resource${filtered.length === 1 ? '' : 's'}`;

  filtered.forEach(resource => {
    const article = document.createElement("article");
    article.className = "bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all";
    
    article.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <span class="truncate max-w-[180px]">${resource.category}</span>
          <span class="text-slate-500 font-normal">#${resource.id}</span>
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
        <button type="button" data-id="${resource.id}" class="upvote-btn flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">
          <span>▲</span> <span class="font-semibold">${resource.upvotes}</span>
        </button>
      </footer>
    `;

    resourcesGrid.appendChild(article);
  });

  attachUpvoteListeners();
}

/**
 * Event Listeners
 */
toggleFeedBtn.addEventListener("click", () => {
  if (isShowingLiveFeed) {
    switchToLocalFeed();
  } else {
    fetchLiveResources();
  }
});

searchInput.addEventListener("input", (e) => {
  currentSearchQuery = e.target.value.toLowerCase().trim();
  const datasetToSearch = isShowingLiveFeed ? liveApiResources : localResources;
  renderResources(datasetToSearch);
});

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (isShowingLiveFeed) {
    alert("Switch back to local resources view to submit custom resources.");
    return;
  }

  const titleInput = document.getElementById("title");
  const urlInput = document.getElementById("url");
  const categorySelect = document.getElementById("category");

  const newResource = {
    id: localResources.length + 1,
    title: titleInput.value.trim(),
    url: urlInput.value.trim(),
    category: categorySelect.value,
    description: "Newly submitted community resource item.",
    upvotes: 1
  };

  localResources.unshift(newResource);
  renderResources(localResources);
  submitForm.reset();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function attachUpvoteListeners() {
  const upvoteButtons = document.querySelectorAll(".upvote-btn");
  upvoteButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const dataset = isShowingLiveFeed ? liveApiResources : localResources;
      const targetResource = dataset.find(r => String(r.id) === String(id));
      if (targetResource) {
        targetResource.upvotes += 1;
        renderResources(dataset);
      }
    });
  });
}

// Initial render call
renderResources(localResources);
