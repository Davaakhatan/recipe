import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import { renderRecipe, clearRecipe } from './view/recipeView';

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
    renderLoader(elements.searchResDiv);
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

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

const r = new Recipe(47746);
r.getRecipe();

/**
 * Recipe controller
 */

const controlRecipe = async () => {
  // 1. get id from URL
  const id = window.location.hash.replace("#", "");

  // 2. create model for Recipe
  state.recipe = new Recipe(id);

  // 3. prepare the UI
  clearRecipe();
  renderLoader(elements.recipeDiv);


  // 4. download the recipe
  await state.recipe.getRecipe();

  // 5. calculate the time and ingredients of Recipe
  clearLoader();
  state.recipe.calcTime();
  state.recipe.calcHumanNumber();
  
  // 6. display the Recipe on UI
  renderRecipe(state.recipe);
};


window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);
