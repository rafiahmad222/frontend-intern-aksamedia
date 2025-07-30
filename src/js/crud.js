const CRUD_KEY = "crud_data";
localStorage.removeItem(CRUD_KEY);
if (!localStorage.getItem(CRUD_KEY)) {
  localStorage.setItem(
    CRUD_KEY,
    JSON.stringify([
      { id: 1, name: "John Doe", email: "john@example.com", age: 30 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25 },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35 },
      { id: 4, name: "Alice Brown", email: "alice@example.com", age: 28 },
      { id: 5, name: "Charlie Davis", email: "charlie@example.com", age: 32 },
      { id: 6, name: "Diana Wilson", email: "diana@example.com", age: 29 },
      { id: 7, name: "Edward Miller", email: "edward@example.com", age: 41 },
      { id: 8, name: "Fiona Garcia", email: "fiona@example.com", age: 26 },
      { id: 9, name: "George Martinez", email: "george@example.com", age: 38 },
      { id: 10, name: "Helen Rodriguez", email: "helen@example.com", age: 33 },
      { id: 11, name: "Ian Thompson", email: "ian@example.com", age: 27 },
    ])
  );
}

function getData() {
  return JSON.parse(localStorage.getItem(CRUD_KEY) || "[]");
}
function saveData(data) {
  localStorage.setItem(CRUD_KEY, JSON.stringify(data));
}

function getQuery() {
  const params = new URLSearchParams(window.location.search);
  return {
    page: parseInt(params.get("page")) || 1,
    search: params.get("search") || "",
  };
}
function setQuery(params) {
  const url = new URL(window.location);
  Object.keys(params).forEach((k) => url.searchParams.set(k, params[k]));
  window.history.replaceState({}, "", url);
}

function renderTable() {
  const { page, search } = getQuery();
  const itemsPerPage = 5;
  let data = getData();
  if (search) {
    data = data.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paged = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const tbody = document.getElementById("dataTable");
  if (tbody) {
    tbody.innerHTML = paged
      .map(
        (d) => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${d.name}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${d.email}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${d.age}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                    <button onclick="editItem(${d.id})" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                        Edit
                    </button>
                    <button onclick="deleteItem(${d.id})" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                        Delete
                    </button>
                </td>
            </tr>
        `
      )
      .join("");
  }

  const showingText = document.getElementById("showingText");
  if (showingText) {
    showingText.textContent = `Showing ${paged.length} of ${totalItems} results`;
  }

  // Pagination
  const pagBtns = [];
  for (let i = 1; i <= totalPages; i++) {
    pagBtns.push(`
            <button onclick="goPage(${i})" 
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  i === page
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }">
                ${i}
            </button>
        `);
  }
  const paginationButtons = document.getElementById("paginationButtons");
  if (paginationButtons) {
    paginationButtons.innerHTML = pagBtns.join("");
  }
}

window.goPage = function (pageNum) {
  setQuery({ ...getQuery(), page: pageNum });
  renderTable();
};

// Search
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.value = getQuery().search;
  searchInput.oninput = function (e) {
    setQuery({ ...getQuery(), search: e.target.value, page: 1 });
    renderTable();
  };
}

// Modal logic
function showModal(title, item = {}) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("itemId").value = item.id || "";
  document.getElementById("itemName").value = item.name || "";
  document.getElementById("itemEmail").value = item.email || "";
  document.getElementById("itemAge").value = item.age || "";
}
function hideModal() {
  document.getElementById("modal").classList.add("hidden");
}
const addBtn = document.getElementById("addBtn");
if (addBtn) addBtn.onclick = () => showModal("Add New");
const cancelBtn = document.getElementById("cancelBtn");
if (cancelBtn) cancelBtn.onclick = hideModal;
const itemForm = document.getElementById("itemForm");
if (itemForm) {
  itemForm.onsubmit = function (e) {
    e.preventDefault();
    const id = document.getElementById("itemId").value;
    const name = document.getElementById("itemName").value;
    const email = document.getElementById("itemEmail").value;
    const age = parseInt(document.getElementById("itemAge").value);
    let data = getData();
    if (id) {
      data = data.map((d) => (d.id == id ? { ...d, name, email, age } : d));
    } else {
      data.push({ id: Date.now(), name, email, age });
    }
    saveData(data);
    hideModal();
    renderTable();
  };
}
window.editItem = function (id) {
  const item = getData().find((d) => d.id == id);
  showModal("Edit Item", item);
};
window.deleteItem = function (id) {
  if (confirm("Delete this item?")) {
    saveData(getData().filter((d) => d.id != id));
    renderTable();
  }
};

document.addEventListener("DOMContentLoaded", renderTable);
renderTable();
