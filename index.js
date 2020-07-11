const shoppingForm = document.querySelector(".shopping");
const list = document.querySelector(".list");

// We will store our state in ouur array
const items = [];

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
  <button aria-label"Remove ${item.name}">&times;</button>
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

shoppingForm.addEventListener("submit", handleSubmit);
list.addEventListener("itemsUpdated", displayItems);
list.addEventListener("itemsUpdated", mirrorToLocalStorage);

restoreFromLocalStorage();
