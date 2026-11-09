// Initial Resource State Array
let resources = [
  { id: 1, title: "Tailwind CSS Documentation", category: "CSS / Design", description: "A utility-first CSS framework packed with classes that can be composed to build any design.", url: "https://tailwindcss.com", upvotes: 142 },
  { id: 2, title: "React Official Guide", category: "Frontend", description: "The library for web and native user interfaces. Build modular components with state.", url: "https://react.dev", upvotes: 310 },
  { id: 3, title: "Express.js Routing Guide", category: "Backend", description: "Fast, unopinionated, minimalist web framework for Node.js backend architecture.", url: "https://expressjs.com", upvotes: 95 },
  { id: 4, title: "MongoDB Mongoose Docs", category: "Database", description: "Elegant mongodb object modeling for node.js with schema validation.", url: "https://mongoosejs.com", upvotes: 215 },
  { id: 5, title: "MDN Web Docs JavaScript", category: "Frontend", description: "Resources for developers, by developers. Comprehensive JavaScript reference guides.", url: "https://developer.mozilla.org", upvotes: 420 }
];

const resourcesGrid = document.getElementById("resources-grid");
const searchInput = document.getElementById("search-input");
const resourceCount = document.getElementById("resource-count");
const submitForm = document.getElementById("submit-form");

function renderResources(items) {
  resourcesGrid.innerHTML = "";

  if (items.length === 0) {
    resourcesGrid.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-500">
        <p class="text-base">No resources found matching your search.</p>
      </div>
    `;
    resourceCount.textContent = "0 resources";
    return;
  }

  resourceCount.textContent = `${items.length} resource${items.length === 1 ? '' : 's'}`;

  items.forEach(resource => {
    const article = document.createElement("article");
    article.className = "bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all";
    
    article.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <span>${resource.category}</span>
          <span class="text-slate-500 font-normal">ID: #${resource.id}</span>
        </div>
        <h3 class="text-lg font-bold text-white">${resource.title}</h3>
        <p class="text-sm text-slate-400 line-clamp-3">
          ${resource.description}
        </p>
      </div>
      <footer class="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm">
        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 font-medium hover:underline">
          Visit Resource &rarr;
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

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  const filtered = resources.filter(res => 
    res.title.toLowerCase().includes(query) || 
    res.category.toLowerCase().includes(query) ||
    res.description.toLowerCase().includes(query)
  );
  renderResources(filtered);
});

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleInput = document.getElementById("title");
  const urlInput = document.getElementById("url");
  const categorySelect = document.getElementById("category");

  const newResource = {
    id: resources.length + 1,
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

function attachUpvoteListeners() {
  const upvoteButtons = document.querySelectorAll(".upvote-btn");
  upvoteButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.getAttribute("data-id"));
      const targetResource = resources.find(r => r.id === id);
      if (targetResource) {
        targetResource.upvotes += 1;
        renderResources(resources);
      }
    });
  });
}

renderResources(resources);
