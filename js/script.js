// подключение сервера с данными
const API_URL = "https://tarry-juniper-chanter.glitch.me/";

// переменная стоимости товара
const price = {
	Клубника: 60,
	Киви: 55,
	Банан: 50,
	Маракуйя: 90,
	Манго: 70,
	Яблоко: 45,
	Мята: 50,
	Лед: 10,
	Биоразлагаемый: 20,
	Пластиковый: 0,
};



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
		<button class="btn coctail__btn coctail__btn-add" type="button" data-id = "${item.id}">
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


// получение данных из формы для калькулятора
const getFormData = (form) => {
	const formData = new FormData(form);
	const data = {};
	for (const [name, value] of (formData.entries())) {
		if (data[name]) {
			if (!Array.isArray(data[name])) {
				data[name] = [data[name]]
			}
			data[name].push(value)
		} else {
			data[name] = value;
		}
	}

	return data;
}



// функция калькулятора подсчет формы состовляющей коктейль
const calculateTotalPrice = (form, startPrice) => {
	let totalPrice = startPrice;
	const data = getFormData(form);

	if (Array.isArray(data.ingredients)) {
		data.ingredients.forEach(item => {
			totalPrice += price[item] || 0
		})
	}
	else {
		totalPrice += price[data.ingredients] || 0
	}

	if (Array.isArray(data.toppings)) {
		data.ingredients.forEach(item => {
			totalPrice += price[item] || 0
		})
	}
	else {
		totalPrice += price[data.toppings] || 0
	}

	totalPrice += price[data.cup] || 0;

	return totalPrice
};


// данные для калькулятора 
const calculateMakeYuorOwn = () => {
	const formMakeOwn = document.querySelector('.make__form-your-own');
	const makeInputPrice = formMakeOwn.querySelector('.maik__input-price');
	const makeTotalPrice = formMakeOwn.querySelector('.make__total-price');

	const hendlerChange = () => {
		const totalPrice = calculateTotalPrice(formMakeOwn, 150);
		makeInputPrice.value = totalPrice;
		makeTotalPrice.textContent = `${totalPrice} ₽`;
	}

	formMakeOwn.addEventListener('change', hendlerChange);
	hendlerChange();
};

// функция получения данных 
const init = async () => {
	modalController({
		modal: '.modal__order', btnOpen: '.header__btn-order',
	});

	calculateMakeYuorOwn();

	modalController({
		modal: ".modal__make-your-own",
		btnOpen: ".coctail__btn-make",
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



	modalController({
		modal: '.modal__add',
		btnOpen: '.coctail__btn-add'
	})
}

// функция модального окна
const modalController = ({ modal, btnOpen, time = 300 }) => {
	const buttomElems = document.querySelectorAll(btnOpen);
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
	buttomElems.forEach(buttomElem => {
		buttomElem.addEventListener('click', openModal);
	})
	modalElem.addEventListener('click', closeModal);

	return { openModal, closeModal };
}



init();