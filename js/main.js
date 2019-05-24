const submit = document.getElementById('submit');
const input = document.getElementById('input');
const dark = document.querySelector('.dark-theme');
const light = document.querySelector('.light-theme');

submit.onclick = function() {
	const bodyClass = document.body.getAttribute('class');

	if (!input.classList.contains('input-active')) {
		switch (bodyClass) {
			case 'dark-theme-body':
				input.classList.add('input-active');
				submit.classList.add('dark-submit-active');
				break;
			case 'light-theme-body':
				input.classList.add('input-active');
				submit.classList.add('light-submit-active');
				break;
			default:
				return false;
				break;
		}
	}

	input.focus();

	const search = input.value;
	searchArticles(search);
}

input.onkeyup = function(e) {
	const search = input.value;
	if (e.keyCode == 13) searchArticles(search);
}

// Темная тема
dark.onclick = function() {
	const articles = document.querySelectorAll('.results');
	removeClasses(articles);
	document.body.classList.add('dark-theme-body');
	// Если открыта поисковая строка
	if (input.classList.contains('input-active')) {
		input.setAttribute('class', 'dark-theme-input input-active');
		submit.setAttribute('class', 'dark-submit dark-submit-active');
	}
	else {
		input.setAttribute('class', 'dark-theme-input');
		submit.setAttribute('class', 'dark-submit');
	}

	for (let i = 0; i < articles.length; i++) {
		const a = articles[i].children[0];
		const p = articles[i].children[1];

		a.classList.add('dark-theme-a');
		p.classList.add('dark-theme-p');
	}
}

light.onclick = function() {
	const articles = document.querySelectorAll('.results');
	removeClasses(articles);
	document.body.classList.add('light-theme-body');
	// Если открыта поисковая строка	
	if (input.classList.contains('input-active')) {
		input.setAttribute('class', 'light-theme-input input-active');
		submit.setAttribute('class', 'light-submit light-submit-active');
	}
	else {
		input.setAttribute('class', 'light-theme-input');
		submit.setAttribute('class', 'light-submit');
	}

	for (let i = 0; i < articles.length; i++) {
		const a = articles[i].children[0];
		const p = articles[i].children[1];

		a.classList.add('light-theme-a');
		p.classList.add('light-theme-p');
	}
}

function searchArticles(search) {
	const url = 'https://ru.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=' + search;
	const request = new XMLHttpRequest();
	request.open('GET', url);
	request.responseType = 'json';
	request.onload = function() {
		const names = request.response[1];
		const links = request.response[3];

		// Обнуление запросов
		document.querySelector('.articles').innerHTML = '';

		for (let i = 0; i < names.length; i++) {
			getText(names[i], links[i]);
		}
	}
	request.send();
}

function getText(names, links) {
	const url = 'https://ru.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro=&explaintext=&titles=' + names;
	const request = new XMLHttpRequest();
	request.open('GET', url);
	request.responseType = 'json';
	request.onload = function() {
		const req = request.response.query.pages;
        const obj = Object.keys(req)[0];
        // Получить текст статьи и ограничить до 35 слов
        let text = req[obj].extract.split(' ').splice(',', 35);
    
        push(names, text, links);
	}
	request.send();
}

function push(names, text, links) {
	// Если пустой запрос
	if (text.length <= 1) return false;

	const div = document.createElement('div');
	div.classList.add('results');
	document.querySelector('.articles').appendChild(div);

	const a = document.createElement('a');
	a.setAttribute('href', links);
	a.setAttribute('target', '_blank');
	a.innerHTML = names;
	addTheme(a);
	div.appendChild(a);

	const p = document.createElement('p');
	p.innerHTML = text.join(' ') + '...';
	addTheme(p);
	div.appendChild(p);
}

function addTheme(tag) {
	const bodyClass = document.body.getAttribute('class');
	const tagName = tag.tagName.toLowerCase();

	switch (bodyClass) {
		case 'dark-theme-body':
			tag.classList.add('dark-theme-' + tagName);
			break;
		case 'light-theme-body':
			tag.classList.add('light-theme-' + tagName);
			break;
		default:
			return false;
			break;
	}
}

function removeClasses(articles) {
	document.body.removeAttribute('class');

	for (let i = 0; i < articles.length; i++) {
		articles[i].children[0].removeAttribute('class');
		articles[i].children[1].removeAttribute('class');
	}
}