const shoppingForm = document.querySelector(".shopping");
const list = document.querySelector(".list");

// We will store our state in ouur array
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  console.log("submitted");
  const name = e.currentTarget.item.value;
  // If empty don't submit
  if (!name) return;
  const item = {
    name,
    id: Date.now(),
    complete: false,
  };
  items.push(item);
  console.log(`there are now  ${items.length} in your state`);
  e.target.reset();
  // Fire off custom event let know everyone items have been updated
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function displayItems() {
  console.log(items);
  const html = items
    .map(
      (item) => `<li class="shopping-item">
  <input type="checkbox">
  <span class="itemName">
  ${item.name}
  </span>
  <button aria-label"Remove ${item.name}"
  value="${item.id}"
  >&times;</button>
  </li>`
    )
    .join("");
  list.innerHTML = html;
  console.log(html);
}

function mirrorToLocalStorage() {
  console.info("Saving Items to localStorage");
  localStorage.setItem("items", JSON.stringify(items));
}

function restoreFromLocalStorage() {
  console.info("Restoring from LS");

  const lsItems = JSON.parse(localStorage.getItem("items"));
  if (lsItems.length) {
    // items = lsItems;
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  console.log(items);
  console.log("Deleting Item", id);
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

shoppingForm.addEventListener("submit", handleSubmit);
list.addEventListener("itemsUpdated", displayItems);
list.addEventListener("itemsUpdated", mirrorToLocalStorage);
// Event delegation listen for click on list <ul> but delegate click to button if clicked
list.addEventListener("click", function (e) {
  if (e.target.matches("button")) {
    deleteItem(parseInt(e.target.value));
  }
});
restoreFromLocalStorage();

const buttons = list.querySelectorAll("button");

console.log(buttons);

buttons.forEach((button) => button.addEventListener("click", deleteItem));
