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
