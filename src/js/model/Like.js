export default class Likes {
  constructor() {
    this.readDataFromLocalStorage();

    if(!this.likes ) this.likes = [];
  }

  addLike(id, title, publisher, img) {
    const like = { id, title, publisher, img };

    this.likes.push(like);

    // save to Local storage
    this.saveDataToLocalStorage();
    return like;
  }

  deleteLike(id) {
    // find id form the like index array
    const index = this.likes.findIndex((el) => el.id === id);

    // delete the idem after found the id from array
    this.likes.splice(index, 1);

    // delete from Local Storage
    this.saveDataToLocalStorage();
  }

  isLiked(id) {
    if (this.likes.findIndex((el) => el.id === id) === -1) return false;
    else return true;

    // return this.likes.findIndex((el) => el.id === id) === -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  saveDataToLocalStorage() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readDataFromLocalStorage() {
    this.likes = JSON.parse(localStorage.getItem("likes"));
  }
}
