const STORIES_TO_SHOW = 30;

const storiesEl = document.getElementById("text");
const storyCountEl = document.getElementById("storyCount");
const updatedAtEl = document.getElementById("updatedAt");
const refreshBtn = document.getElementById("refreshBtn");

if (refreshBtn) {
  refreshBtn.addEventListener("click", loadStories);
}

loadStories();

async function loadStories() {
  try {
    renderLoading();

    const idsResponse = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const ids = await idsResponse.json();
    const selectedIds = ids.slice(0, STORIES_TO_SHOW);

    const stories = await Promise.all(
      selectedIds.map(async (id) => {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return response.json();
      })
    );

    const filteredStories = stories.filter(Boolean);
    renderStories(filteredStories);

    if (storyCountEl) {
      storyCountEl.textContent = String(filteredStories.length);
    }

    if (updatedAtEl) {
      updatedAtEl.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
  } catch (error) {
    storiesEl.innerHTML = "";
    const empty = document.createElement("article");
    empty.className = "empty-state";
    empty.textContent = "Unable to load stories right now. Please refresh and try again.";
    storiesEl.appendChild(empty);

    if (updatedAtEl) {
      updatedAtEl.textContent = "Failed to update";
    }
  }
}

function renderLoading() {
  storiesEl.innerHTML = "";

  for (let i = 0; i < 9; i += 1) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton";
    storiesEl.appendChild(skeleton);
  }
}

function renderStories(stories) {
  storiesEl.innerHTML = "";

  if (stories.length === 0) {
    const empty = document.createElement("article");
    empty.className = "empty-state";
    empty.textContent = "No stories found.";
    storiesEl.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  stories.forEach((story, index) => {
    const card = document.createElement("article");
    card.className = "wish-text";
    card.style.setProperty("--i", index);

    const rank = document.createElement("span");
    rank.className = "story-rank";
    rank.textContent = `#${index + 1}`;

    const title = document.createElement("h3");
    title.className = "story-title";
    title.textContent = story.title || "Untitled story";

    const meta = document.createElement("p");
    meta.className = "story-meta";
    const score = `${story.score || 0} points`;
    const author = `by ${story.by || "unknown"}`;
    const comments = `${story.descendants || 0} comments`;
    const time = story.time ? formatRelativeTime(story.time) : "just now";
    meta.textContent = `${score} • ${author} • ${comments} • ${time}`;

    const link = document.createElement("a");
    link.className = "story-link";
    link.href = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `Read story on ${getHostName(story.url)}`;

    card.appendChild(rank);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(link);
    fragment.appendChild(card);
  });

  storiesEl.appendChild(fragment);
}

function getHostName(url) {
  if (!url) {
    return "Hacker News";
  }

  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "source";
  }
}

function formatRelativeTime(unixSeconds) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const diff = Math.max(nowSeconds - unixSeconds, 0);

  if (diff < 60) {
    return "moments ago";
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  }

  return `${Math.floor(diff / 86400)}d ago`;
}




