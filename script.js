const ITEMS_LIST = document.querySelector('.items-list');
const ITEMS_INPUT = document.querySelector('.items-input');
const SORTING_BTNS = document.querySelector('.sorting-btns');

let LIST = [];

async function shoppingList() {
  let response = await fetch('https://online-shopping-list-app-b90c3.firebaseio.com/.json');
  LIST = await response.json();
  displayList();
}

function displayList() {
  let liItem = '';

  for (let i = 0; i < LIST.length; i++) {
    if (LIST[i].checked) {
      liItem += `
	      <li onclick="checkedItem(${i})" class="checked">${LIST[i].item}<span class="delete" onclick="delItem(event, ${i})">X</span></li>
	    `;
    } else {
      liItem += `
	      <li onclick="checkedItem(${i})">${LIST[i].item}<span class="delete" onclick="delItem(event, ${i})">X</span></li>
	    `;
    }
  }

  ITEMS_LIST.innerHTML = liItem;
}

async function addItem(event) {
  event.preventDefault();

  const NEW_ITEM = {
    item: ITEMS_INPUT.value
  };

  if (ITEMS_INPUT.value === '') {
    alert('Please enter the item you want to buy!');
  } else {
    let response = await fetch('https://online-shopping-list-app-b90c3.firebaseio.com/.json', {
      method: 'POST',
      body: JSON.stringify(NEW_ITEM)
    });
  }

  ITEMS_INPUT.value = '';

  if (LIST.length >= 2) SORTING_BTNS.classList.remove('hidden');

  await shoppingList();
}

function addItemByEnter(event) {
  if (event.key === 'Enter') {
    addItem(event);
  }
}

async function delItem(event, idx) {
  event.stopPropagation();

  if (confirm(`Don't want to buy ${LIST[idx].item} anymore?`)) {
    let response = await fetch(`https://online-shopping-list-app-b90c3.firebaseio.com/${idx}.json`, {
      method: 'DELETE'
    });

    await shoppingList();
  }

  if (LIST.length < 2) SORTING_BTNS.classList.add('hidden');
}

async function checkedItem(idx) {
  LIST[idx].checked = true;

  await shoppingList();
}

function sortAsc() {
  LIST.sort(function (a, b) {
    return a.item.toLowerCase() < b.item.toLowerCase() ? -1 : 1;
  })

  shoppingList();
}

function sortDesc() {
  LIST.sort(function (a, b) {
    return a.item.toLowerCase() > b.item.toLowerCase() ? -1 : 1;
  })

  shoppingList();
}