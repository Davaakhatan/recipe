import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";

/**
 * Web  app state
 * - Search query, result
 * - particular recipe
 * - liked recipies
 * - ingredients of recipe which is ordered.
 */

const state = {};
const controlSearch = async () => {
  // 1. to show key words from search
  const query = searchView.getInput();

  if (query) {
    // 2. create New search object
    state.search = new Search(query);
    // 3. prepare the UI for search.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResDiv)
    // 4. complete search

    await state.search.doSearch();

    // 5. show the result of search
    clearLoader();
    if (state.search.result === undefined) alert("no data...");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});
