const ITEMS_LIST = document.querySelector('.items-list');
const ITEMS_INPUT = document.querySelector('.items-input');
const SORTING_BTNS = document.querySelector('.sorting-btns');

let onlineList = {};

async function shoppingList() {
  const ONLINE_LIST_RESPONSE = await fetch('https://online-shopping-list-app-b90c3.firebaseio.com/.json');
  onlineList = await ONLINE_LIST_RESPONSE.json();
  displayList();
}

function displayList() {
  let liItem = '';

  for (let i in onlineList) {
    if (onlineList[i].checked) {
      liItem += `
	      <li onclick="checkedItem('${i}')" class="checked">${onlineList[i].item}<span class="delete" onclick="delItem(event, '${i}')">X</span></li>
	    `;
    } else {
      liItem += `
	      <li onclick="checkedItem('${i}')">${onlineList[i].item}<span class="delete" onclick="delItem(event, '${i}')">X</span></li>
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
    const RESPONSE = await fetch('https://online-shopping-list-app-b90c3.firebaseio.com/.json', {
      method: 'POST',
      body: JSON.stringify(NEW_ITEM)
    });
  }

  ITEMS_INPUT.value = '';

  await shoppingList();
}

function addItemByEnter(event) {
  if (event.key === 'Enter') {
    addItem(event);
  }
}

async function delItem(event, idx) {
  event.stopPropagation();

  if (confirm(`Don't want to buy ${onlineList[idx].item} anymore?`)) {
    const RESPONSE = await fetch(`https://online-shopping-list-app-b90c3.firebaseio.com/${idx}.json`, {
      method: 'DELETE'
    });

    await shoppingList();
  }
}

async function checkedItem(idx) {
  const RESPONSE = await fetch(`https://online-shopping-list-app-b90c3.firebaseio.com/${idx}/checked.json`, {
    method: 'PUT',
    body: JSON.stringify(true)
  });

  await shoppingList();
}