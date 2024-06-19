import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List";
import Like from "./model/Like";
import * as likesView from "./view/likesView";
import * as listView from "./view/listView";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView";

/**
 * Web  app state
 * - Search query, result
 * - particular recipe
 * - liked recipies
 * - ingredients of recipe which is ordered.
 */

const state = {};

/**
 * Search controller = Model ==> Controller <== View
 */
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

  // if there is an id on URL
  if (id) {
    // 2. create model for Recipe
    state.recipe = new Recipe(id);

    // 3. prepare the UI
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);

    // 4. download the recipe
    await state.recipe.getRecipe();

    // 5. calculate the time and ingredients of Recipe
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHumanNumber();

    // 6. display the Recipe on UI
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

window.addEventListener("load", (e) => {
  // create new like model when app launched
  if (!state.likes) state.likes = new Like();

  // remove like
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

  // If like on localstorage add them to list
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});
/**
 * Recipe  Controller
 */

const controlList = () => {
  // create model for recipe
  state.list = new List();

  // remove the privous items
  listView.clearItems();
  // put all ingredients of that model into here
  // state.recipe.ingredients
  state.recipe.ingredients.forEach((n) => {
    const item = state.list.addItem(n);

    // display to UI that ingredients
    listView.renderItem(item);
  });
};

/**
 * Like controller
 */
const controlLike = () => {
  // 1. create Like model
  if (!state.likes) state.likes = new Like();

  // 2. find the id of current recipe
  const currentRecipeId = state.recipe.id;

  // 3. check whether that id is liked or not
  if (state.likes.isLiked(currentRecipeId)) {
    // 4. if it's liked, remove the like
    state.likes.deleteLike(currentRecipeId);
    // delete from the Menu
    likesView.deleteLike(currentRecipeId);

    //
    likesView.toggleLikeButton(false);
  } else {
    // 5. if not, add like
    const newLIke = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );
    likesView.renderLike(newLIke);
    likesView.toggleLikeButton(true);
  }
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  // take the id after click li element's data-itemid
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // delete the recipe where we found/
  state.list.deleteItem(id);

  // delete from the display that ID ingredient
  listView.deleteItem(id);
});
