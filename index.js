import './style.css';

var headers = Array.from(document.querySelectorAll('.headers > div')),
  search = document.getElementById('search-field'),
  clear = document.querySelector('.clear'),
  caret = document.querySelector('.caret'),
  body = document.querySelector('.body'),
  filterType = null,
  filtered = null,
  data = null,
  markup = '',
  str = '';

clear.addEventListener('click', () => {
  search.value = '';
  populateTable(slicedArray);
  clear.classList.remove('enable-clear');
});

search.addEventListener('keyup', () => {
  str = search.value.toString();
  const lowercase = str.toLowerCase();
  const arr = data.projects;
  if (lowercase != '' && lowercase.length > 2) {
    filtered = [];
    for (let x of arr) {
      Object.values(x).filter((val) => {
        if (x.tags.includes(lowercase)) {
          filtered.push(x);
          filtered = filtered.filter((item, i) => filtered.indexOf(item) === i);
          populateTable(filtered);
        }
        clear.classList.add('enable-clear');
      });
    }
  } else populateTable(arr);
});

function populateTable(arr) {
  markup = '';
  body.innerHTML = '';
  renderData(arr);
  body.innerHTML = markup;
}

// RETURN THE HTML
function renderData(arr) {
  for (var i = 0; i < arr.length; i++) {
    markup +=
      '<a href="' +
      arr[i].url +
      '"target="_blank" class="tble-rows">' +
      '<div class="tble-cells">' +
      arr[i].title +
      '</div>' +
      '<div class="tble-cells">' +
      arr[i].description +
      '</div>' +
      '<div class="tble-cells">' +
      arr[i].technologies +
      '</div>' +
      `</a>`;
  }
  const total = document.querySelector('#total');
  total.innerText = arr.length;
}

function comparison(key, order = 'ascending') {
  return (a, b) => {
    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'descending' ? comparison * -1 : comparison;
  };
}

function sortColumn(e) {
  let index = null;
  filterType = e.target.innerHTML.toLowerCase();
  data.projects.sort(comparison(filterType));
  populateTable(data.projects);

  caret != undefined ? caret.remove() : '';
  caret = document.createElement('span');
  caret.classList.add('caret');
  caret.innerHTML = '&#x25B2';
  index = e.target.getAttribute('data-id');
  e.target.appendChild(caret);
}

(async () => {
  data = null;
  const { default: json } = await import('./data.json', {
    assert: { type: 'json' },
  });
  data = json;
  populateTable(data.projects);
  for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('click', sortColumn);
  }
})();
