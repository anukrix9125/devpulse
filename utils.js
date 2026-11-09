// Mock developer resources dataset
const resources = [
  { id: 1, title: "Tailwind CSS Docs", category: "CSS", upvotes: 142, active: true },
  { id: 2, title: "React Official Guide", category: "Frontend", upvotes: 310, active: true },
  { id: 3, title: "Express.js Routing Guide", category: "Backend", upvotes: 95, active: false },
  { id: 4, title: "MongoDB Mongoose Docs", category: "Database", upvotes: 215, active: true },
  { id: 5, title: "MDN Web Docs JavaScript", category: "Frontend", upvotes: 420, active: true }
];

/**
 * Arrow Function & Array Filter: Get only active resources in a specific category
 */
const getActiveResourcesByCategory = (items, targetCategory) => {
  return items.filter(item => item.active && item.category.toLowerCase() === targetCategory.toLowerCase());
};

/**
 * 2. Destructuring & Array Map: Format resource titles for UI display
 */
const getFormattedResourceTitles = (items) => {
  return items.map(({ title, upvotes }) => {
    return `[${upvotes} Upvotes] - ${title}`;
  });
};

/**
 * 3. Array Reduce: Calculate total upvotes across all resources
 */
const getTotalUpvotes = (items) => {
  return items.reduce((accumulator, currentItem) => accumulator + currentItem.upvotes, 0);
};

// --- Execution & Verification ---
console.log("--- DevPulse Utility Scripts ---");

const frontendResources = getActiveResourcesByCategory(resources, "Frontend");
console.log("Active Frontend Resources:", frontendResources);

const formattedTitles = getFormattedResourceTitles(resources);
console.log("Formatted Titles:", formattedTitles);

const totalCommunityUpvotes = getTotalUpvotes(resources);
console.log(`Total Community Upvotes: ${totalCommunityUpvotes}`);
