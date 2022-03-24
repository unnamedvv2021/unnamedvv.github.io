let cnt = 0;
let x, y, offsetx, offsety;
let canvas = document.getElementById("dest_copy");
let editable = false;
class Item{
    // item_id is the auto-generated id for each item as soon as it's constructed
    item_id;
    // count_id;
    name;
    start_time; 
    end_time;
    setup_time;
    breakdown_time;
    // type should be consistent with the id of the items in the repository shown in HTML
    type;
    pos_x;
    pos_y;
    rotate;
    width;
    length;
    constructor(){
        
    }
    draw(){
        console.log("item drawing " + this.type);
        let div = document.getElementById(this.type);
        let copy = div.cloneNode(true);
        copy.id = this.item_id;
        copy.name = this.name;
        copy.setAttribute("class", "items");
        copy.setAttribute("oncontextmenu", "rightClick(event);");
        copy.style.cssText += `position: absolute; left: ${this.pos_x}px; top: ${this.pos_y}px;`;
        canvas.appendChild(copy);
    }
}
class Plan{
    items;
    constructor(){
        // I use hashmap to store all the items to make sure the storage used is low and deleting and searching fast.
        // However, I still need to perform the sorting algorithm, I would prefer to generate a new array and then sort it by the required attribute
        // the time complexity is O(n + nlogn) = O(nlogn)
        this.items = new Map();
    }
    addItem(item){
        let id = item.id;
        if(this.items.has(id)){
            // it's wrong, as the id is self-incremented, we shouldn't have 
        }else{
            this.items[id] = item;
        }
    }
    deleteItem(id){
        if(this.items.has(id)){
            this.items.delete(id);
        }else{
            // no such item
        }
    }
    draw(){
        console.log("plan drawing");
        console.log(this.items.size);
        this.items.forEach(drawItems);
    }  
}
// hashmap iteration function
function drawItems(value, key, map){
    value.draw();
}
function clickToEdit(e){
    editable = true;
    console.log(editable);
    return;
}
function clickToSave(e){
    editable = false;
    // communicate with the server
    return;
}
function dragstart_handler(ev) {
    if(editable == false){
        return;
    }
    let dragdiv = ev.currentTarget;
    let id = dragdiv.id;
    offsetx = ev.clientX - dragdiv.getBoundingClientRect().left;
    offsety = ev.clientY - dragdiv.getBoundingClientRect().top;
    if(dragdiv.getAttribute("class") == "items"){
        dragdiv.style.opacity = 0.5;
    }
    // update the dataTransfer
    ev.dataTransfer.setData("text", ev.currentTarget.id);
    ev.dataTransfer.setDragImage(dragdiv, offsetx * 2, offsety * 2);
    // Tell the browser both copy and move are possible
    ev.effectAllowed = "copyMove";
    
}
function dragover_handler(ev) {
    ev.preventDefault();
    console.log("dragOver");
}

function drop_handler(ev) {
    x = ev.clientX;
    y = ev.clientY;
    console.log("Drop");
    ev.preventDefault();
    let id = ev.dataTransfer.getData("text");
    let dragDiv = document.getElementById(id);
    if (dragDiv.getAttribute("class") == "sourceItems" && ev.target.id == "dest_copy") {
        // copy an item and show it on the screen
        // "true" in parentheses ensures that the entire div is copied, including deeper elements
        var nodeCopy = dragDiv.cloneNode(true);
        nodeCopy.id = cnt;
        nodeCopy.style.cssText += `position: absolute; left: ${x - offsetx}px; top: ${y - offsety}px;`;
        nodeCopy.setAttribute("oncontextmenu", "rightClick(event);");
        nodeCopy.setAttribute("class", "items");
        ev.target.appendChild(nodeCopy);
        cnt++;
        // store the item into the plan object and then send it to the server
        let current_item = new Item();

    }
    // here is a bug, when the target location is outside of the "dest_copy" but still inside
    // the current div (ev.target.id == id), it still works for the drag
    else if (dragDiv.getAttribute("class") == "items" && (ev.currentTarget.id == "dest_copy" || ev.currentTarget.id == id)) {
        dragDiv.style.cssText = "position:absolute; left: 120px; top: 240px;";
        dragDiv.style.cssText += `position: absolute; left: ${x - offsetx}px; top: ${y - offsety}px;`;
    }
}
function dragend_handler(ev) {
    console.log("dragEnd");
    document.getElementById(ev.currentTarget.id).style.opacity = 1;
    // Remove all of the drag data
    ev.dataTransfer.clearData();
}
function rightClick(e){
    if(editable == false){
        return;
    }
    e.preventDefault();
    closeMenu();
    let menu = createMenu(e);
    canvas.appendChild(menu);
    // when clicking on any other space except the menu, the menu disappear
    document.addEventListener('click', function(e){
        closeMenu();
    })
}
function closeMenu(){
    let findMenu = document.getElementById("deletionMenu");
    if(findMenu){
        findMenu.remove();
    }
}

function createMenu(e){
    x = e.clientX;
    y = e.clientY;
    let newDiv = document.createElement("ul");
    newDiv.id = "deletionMenu";
    newDiv.setAttribute("class", "context-menu");
    newDiv.style.cssText = `position: absolute; left: ${x}px; top: ${y}px;`;
    let sub1 = createOptionsInMenu(e, "delete");
    let sub2 = createOptionsInMenu(e, "edit");
    newDiv.appendChild(sub1);
    newDiv.appendChild(sub2);
    return newDiv;
}
// str represents the text
function createOptionsInMenu(e, str){
    let opt = document.createElement("li");
    opt.textContent = str;
    let id = e.currentTarget.id;
    opt.setAttribute("onclick", `${str}Item(${id});`);
    return opt;
}
// select deletion
function deleteItem(id){
    console.log("complete deletion");
    document.getElementById(id).remove();
}
function editItem(id){

}

// decode from JSON
function decodeJSON(str){
    // update current cnt, it should be acquired from the JSON code
    cnt = 13;
    let plan = new Plan();
    // decode the JSON
    
    // mock a plan
    let it1 = new Item();
    it1.item_id = 0;
    it1.type = "src_copy0";
    it1.pos_x = 400;
    it1.pos_y = 200;

    let it2 = new Item();
    it2.item_id = 12;
    it2.type = "src_copy2";
    it2.pos_x = 700;
    it2.pos_y = 400;
    plan.items.set(1, it1);
    plan.items.set(12, it2);
    console.log("decodeJson " + plan.items.size);
    return plan;
}
// get JSON from server
function getJSON(){
    let str = new String();
    // maybe calling the interface from the server
    return str;
}
// when loading, get the JSON data and then draw the plan
// plan is a global variable
window.onload = function(){
    console.log("loading");
    let json = getJSON();
    let plan = decodeJSON(json);
    plan.draw();
}

