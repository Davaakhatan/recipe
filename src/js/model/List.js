import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = [];
    }

    deleteItem(id){
        // find id form the recipe index array 
        const index = this.items.findIndex(el => el.id === id);

        // delete the idem after found the id from array
        this.items.splice(index, 1);
    }

    addItem(item){
        let newItem = {
            id: uniqid(),
            item
        }
        this.items.push(newItem);

        return newItem;
    }
}