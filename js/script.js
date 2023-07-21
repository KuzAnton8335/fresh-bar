// подключение сервера с данными
const API_URL = "https://tarry-juniper-chanter.glitch.me/";

// функция подключения k данным на сервере
const getData = async () => {
	// const response = await fetch(API_URL + "api/goods");
	const response = await fetch(`${API_URL}api/goods`);
	const data = response.json();
	return data;
};


// функция втавки карточки товара с сервера
const creatCard = (item) => {
	const cocktail = document.createElement('artical');
	cocktail.classList.add("coctail");
	cocktail.innerHTML = `
	<picture class="goods__picture">
		<source
			srcset="${API_URL}${item.image}"
			media="(max-width:768px)"
		/>
		<img
			src="${API_URL}${item.image}"
			alt=" коктейль ${item.title}"
		/>
	</picture>
	<div class="coctail__content">
		<div class="coctail__text">
			<h3 class="coctail__title">${item.title}</h3>
			<p class="coctail__price text-red">${item.price}</p>
			<p class="coctail__size">${item.size}</p>
		</div>
		<button class="btn coctail__btn" type="button" data-id = "${item.id}">
			Добавить
		</button>
	
	`
	return cocktail;
}

// функция получения данных 
const init = async () => {
	const goodsListElem = document.querySelector('.goods__list');
	const data = await getData();

	const cartsCoctail = data.map((item) => {
		const li = document.createElement('li');
		li.classList.add("goods__item");
		li.append(creatCard(item));
		return li;
	})

	goodsListElem.append(...cartsCoctail)
}

init();