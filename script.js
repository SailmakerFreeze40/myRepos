const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

const input = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const repoList = document.getElementById("repo-list");

async function searchRepos() {
  const query = input.value.trim();

  if (!query) {
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
    return;
  }

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query}&per_page=5`,
  );
  const data = await response.json();
  renderSuggestions(data.items);
}

function renderSuggestions(repos) {
  suggestions.innerHTML = "";

  repos.forEach((repo) => {
    const li = document.createElement("li");
    li.textContent = repo.name;
    li.addEventListener("click", () => addRepo(repo));
    suggestions.append(li);
  });

  suggestions.style.display = "block";
}
function addRepo(repo) {
  const li = document.createElement("li");
  li.innerHTML = `
    <div>
      <div>Name: ${repo.name}</div>
      <div>Owner: ${repo.owner.login}</div>
      <div>Stars: ${repo.stargazers_count}</div>
    </div>
    <button>×</button>
  `;

  li.querySelector("button").addEventListener("click", () => li.remove());
  repoList.append(li);

  input.value = "";
  suggestions.innerHTML = "";
  suggestions.style.display = "none";
}

input.addEventListener("input", debounce(searchRepos, 500));
