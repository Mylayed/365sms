"use strict";

$(document).ready(function () {
	$('.filter-style').styler({
		selectSmartPositioning: false
	});


	

	$('.jq-selectbox__dropdown li.operator').click(function () {
		$('.jq-selectbox__select-text').addClass('text-padding');
	});

	$('.jq-selectbox__dropdown li.no-flag').click(function () {
		$('.jq-selectbox__select-text').removeClass('text-padding');
	});

	

	$(".jq-selectbox__dropdown ul").mCustomScrollbar({
		scrollInertia: 700,
		alwaysShowScrollbar: 1
	});
});

function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});

// $(".").inputFilter(function(value) {
// 	return /^-?\d*[.,]?\d*$/.test(value); });

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 100;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});

(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();


(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());


$(document).ready(function () {
	$('body').on('mousedown', 'tr[url]', function (e) {
		var click = e.which;
		var url = $(this).attr('url');
		if (url) {
			if (click == 2 || (click == 1 && (e.ctrlKey || e.metaKey))) {
				window.open(url, '_blank');
				window.focus();
			}
			else if (click == 1) {
				window.location.href = url;
			}
			return true;
		}
	});



	$(document).click(function (event) {
		if ($(event.target).closest(".header__people-avatar-list").length)
			return;
		$(".header__people-avatar-list").removeClass("open");
		$('.header__people-arrow-box .header__people-arrow-item').removeClass('drop');
		event.stopPropagation();
	});
	$('.header__people-avatar-box').click(function () {
		$('.header__people-arrow-box .header__people-arrow-item').toggleClass('drop');
		$(".header__people-avatar-list").toggleClass("open");
		return false;
	});


	$(document).click(function (event) {

		if ($(event.target).closest(".aside").length)
			return;
		$(".aside").removeClass("active");
		event.stopPropagation();
	});

	$('.header__burger-aside').click(function (event) {
		$('.aside').addClass('active');
		return false;
	});

	// copy coupone code to clipboard
	$(".coupon-btn").on("click", function () {
		copyToClipboard("#coupon-field");
		$(".coupon-alert").fadeIn("slow");
	});

	$(".aside__services-box").mCustomScrollbar({
		scrollInertia: 700,
		mouseWheel: { scrollAmount: 55 }
	});


	$('.entrance-btn').on('click', function () {
		$('.entrance-input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.registrations-btn').on('click', function () {
		$('.registrations-input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.discharge-btn').on('click', function () {
		$('.discharge-input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.new-password-btn').on('click', function () {
		$('.new-password-input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.balance__btn').on('click', function () {
		$('.balance__input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.cabinet__btn--active').on('click', function () {
		$('.cabinet__input--voucher').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.cabinet__btn--password').on('click', function () {
		$('.cabinet__input--password').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.pieces-item').each(function () {
		var x = $(this).text();
		if (x == 0) $(this).closest('.aside__services-item').addClass('zero');
		if (x > 0) $(this).closest('.aside__services-item').addClass('many');
		if (x == 100) $(this).closest('.aside__services-item').removeClass('many');
		if (x == 100) $(this).closest('.aside__services-item').removeClass('zero');
		if (x > 100) $(this).closest('.aside__services-item').removeClass('many');
		if (x > 100) $(this).closest('.aside__services-item').removeClass('zero');
	});

	// $('.jq-selectbox__select-text').each(function () {
	// 	let selectText = $(this).text();
	// 	if(selectText == 'Любой оператор'){
	// 		$(this).removeClass('text-padding');
	// 	}
	// });



	// $('.flag').click(function () {
	// 	$('.jq-selectbox__select-text').addClass('text-padding');
	// });

	// $('.no-flag').on('click', function () {
	// 	$('.jq-selectbox__select-text').removeClass('text-padding');
	// });

	$('.cabinet__btn--active').click(function (event) {
		$('.purchase').addClass('result-show');
	});

	$('.cabinet__btn--password').click(function (event) {
		$('.disadvantage').addClass('result-show');
	});



	$('.header__burger').click(function (event) {
		$('.header__menu').addClass('active');
		$('.aside').removeClass('active');
		$('body').addClass('lock');
	});

	$('.js-tab-trigger').on('click', function () {
		var tabName = $(this).data('tab'),
			tab = $('.js-tab-content[data-tab="' + tabName + '"]');

		$('.js-tab-trigger.active').removeClass('active');
		$(this).addClass('active');


		$('.js-tab-content.active').removeClass('active');
		tab.addClass('active');
	});

	$('.tabs-header-btn').click(function (event) {
		$('.tabs-header-container').toggleClass('open');
		$('.tabs-header-btn').toggleClass('active');
	});

	$('.tabs-header__item').click(function (event) {
		$('.tabs-header-container').removeClass('open');
		$('.tabs-header-btn').removeClass('active');
	});

	$('.aside__close').click(function (event) {
		$('.aside').removeClass('active');
	});

	$('.header__menu-close').click(function (event) {
		$('.header__menu').removeClass('active');
		$('body').removeClass('lock');
	});



	$(document).click(function (event) {
		if ($(event.target).closest(".header__people-list").length)
			return;
		$(".header__people-email").removeClass("drop");
		$('.header__people-email-box').removeClass('open');
		event.stopPropagation();
	});

	// $('.header__people-email-box').click(function () {
	// 	$('.header__people-email-box').toggleClass('open');
	// 	$(".header__people-email").toggleClass("drop");
	// 	$(this).siblings(".header__people-list").toggleClass("open");
	// 	return false;
	// });

	// $(document).click(function (event) {
	// 	if ($(event.target).closest(".header__people-avatar-list").length)
	// 		return;
	// 	$(".header__people-arrow-box span").removeClass("drop");
	// 	$('.header__people-arrow-box').removeClass('open');
	// 	event.stopPropagation();
	// });
	// $('.header__people-arrow-box').click(function () {
	// 	$('.header__people-avatar-list').toggleClass('open');
	// 	$(".header__people-arrow-box span").toggleClass("drop");
	// });



	



	// $('.aside__info .header__people-avatar-box').click(function () {
	// 	$('.header__people-avatar-list').toggleClass('open');
	// 	$(".header__people-arrow-box span").toggleClass("drop");
	// 	// $(this).siblings(".header__people-avatar-list").toggleClass("open");
	// 	// return false;
	// });



	$(document).on('click', '.balance__box-item', function () {
		$('.balance__box-item').removeClass("active");
		$(this).toggleClass("active");
	});

	$(document).on('click', '.jq-selectbox__select', function () {
		$(this).toggleClass("drop");
	});

	$(document).on('click', '.jq-selectbox__dropdown li', function () {
		$('.jq-selectbox__select').removeClass("drop");
	});

	// $(document).on('click', '.jq-selectbox', function () {
	// 	if ($('.jq-selectbox').hasClass('dropdown')) {
	// 		$('.jq-selectbox.dropdown .jq-selectbox__select').addClass('drop');
	// 	} else {
	// 		$('.jq-selectbox__select').removeClass('drop');
	// 	}
	// });

	$(document).on('click', 'section', function () {
		$('.jq-selectbox.dropdown .jq-selectbox__select').toggleClass('drop');
	});

	$(document).on('click', '.aside__services-like', function () {
		$(this).toggleClass("active");
	});

	$('#datetimepicker1, #datetimepicker2').datetimepicker({
		locale: 'ru',
		defaultDate: "01/22/2020 23:59:59",
		daysOfWeekDisabled: [0, 6],
		disabledTimeIntervals: [[moment({ h: 0 }), moment({ h: 8 })], [moment({ h: 18 }), moment({ h: 24 })]]
	});

	$('.balance__input').on('input', function () {
		$(this).val($(this).val().replace(/[A-Za-zА-Яа-яЁё]/, ''))
	});

	$('#datetimepicker1, #datetimepicker2').on('input', function () {
		$(this).val($(this).val().replace(/[A-Za-zА-Яа-яЁё]/, ''))
	});

	// $('#datetimepicker12').datetimepicker({
	// 	inline: true,
	// 	// sideBySide: true
	// });


	// copy content to clipboard
	function copyToClipboard(element) {
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val($(element).text()).select();
		document.execCommand("copy");
		$temp.remove();
	}

	// function DisablePinchZoom() {
	// 	$('meta[name=viewport]').attr("content", "");
	// 	$('meta[name=viewport]').attr("content", "width=yourwidth, user-scalable=no");
	// }

	// function myFunction() {
	// 	$('meta[name=viewport]').attr("content", "width=1047, user-scalable=yes");
	// }

});




$(document).ready(function () {
	$('input.files').fileuploader({
		captions: 'ru',
		addMore: true,
		captions: {
			button: function (options) {
				return 'Посмотреть ' + (options.limit == 1 ? 'файл' : 'файли');
			},
			feedback: function (options) {
				return 'Перетащите или выберите с диска';
			},
			feedback2: function (options) {
				return options.length + ' ' + (options.length > 1 ? 'файла были' : 'файл был') + ' выбрано';
			}
		},
		thumbnails: {
			item: '<li class="fileuploader-item">' +
				'<div class="columns">' +
				'<div class="column-thumbnail"><img src="img/icons/preview-image.svg"><span class="fileuploader-action-popup"></span></div>' +
				'<div class="column-title">' +
				'<div title="${name}">${name}</div>' +
				'<span>${size2}</span>' +
				'</div>' +
				'<div class="column-actions">' +
				'<button class="fileuploader-action fileuploader-action-remove" title="${captions.remove}"><i class="fileuploader-icon-remove"></i></a>' +
				'</div>' +
				'</div>' +
				'<div class="progress-bar2">${progressBar}<span></span></div>' +
				'</li>'
		}
	});
});

