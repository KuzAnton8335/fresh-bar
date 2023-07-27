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

// функция блокировки скролла при модальном окне
const scrollServices = {
	scrollPosition: 0,
	disabledScroll() {
		this.scrollPosition = window.scrollY;
		document.documentElement.style.scrollBehavior = 'auto';
		document.body.style.cssText = `
	 		overflow: hidden;
	  		position:fixed;
     		top: -${this.scrollPosition}px;
	  		left:0;
	  		height:100vh;
	  		width:100vw;
	  		padding-right: ${window.innerWidth - document.body.offsetWidth}px;
	  `
	},
	enableScroll() {
		document.body.style.cssText = '';
		window.scroll({
			top: this.scrollPosition
		})
		document.documentElement.style.scrollBehavior = '';
	}

}

// функция получения данных 
const init = async () => {
	modalController({
		modal: '.modal__order', btnOpen: '.header__btn-order',
	});
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

// функция модального окна
const modalController = ({ modal, btnOpen, time = 300 }) => {
	const buttomElem = document.querySelector(btnOpen);
	const modalElem = document.querySelector(modal);

	modalElem.style.cssText = `
	display:flex;
	visibility:hidden;
	opacity:0;
	transution: opacity ${time}ms ease-in-out
	`

	// функция закрытия модального окна
	const closeModal = (event) => {
		const target = event.target;
		const code = event.code;
		// условия закрытия модального окна кнопкой Escape
		if (target === modalElem || code === 'Escape') {
			modalElem.style.opacity = 0;

			setTimeout(() => {
				modalElem.style.visibility = 'hidden';
				scrollServices.enableScroll();
			}, time);

			window.removeEventListener('keydown', closeModal);
		}
	}

	// функция открытия модального окна
	const openModal = () => {
		modalElem.style.visibility = 'visible';
		modalElem.style.opacity = 1;
		window.addEventListener('keydown', closeModal);
		scrollServices.disabledScroll();
	}

	// событие click модального окна
	buttomElem.addEventListener('click', openModal);
	modalElem.addEventListener('click', closeModal);

	return { openModal, closeModal };
}



init();