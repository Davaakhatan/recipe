import { elements } from "./base";

//private function
const renderRecipe = (recipe) => {
  console.log(recipe);
  const markUp = `
    <li>
        <a class="results__link results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
  // add to ul
  elements.searchResultList.insertAdjacentHTML("beforeend", markUp);
};
export const clearSearchQuery = () => {
  elements.searchInput.value = "";
};
export const clearSearchResult = () => {
  elements.searchResultList.innerHTML = "";
};

export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipes) => {
  recipes.forEach(renderRecipe);
};
