//выпадание селекта в нужном направлении:
const modifySelect2 = function() {
    var Defaults = $.fn.select2.amd.require('select2/defaults');

    $.extend(Defaults.defaults, {
        dropdownPosition: 'auto'
    });

    var AttachBody = $.fn.select2.amd.require('select2/dropdown/attachBody');
    var _positionDropdown = AttachBody.prototype._positionDropdown;

    AttachBody.prototype._positionDropdown = function() {
        var $window = $(window);
        var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
        var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');
        var newDirection = null;
        var offset = this.$container.offset();

        offset.bottom = offset.top + this.$container.outerHeight(false);

        var container = {
            height: this.$container.outerHeight(false)
        };

        container.top = offset.top;
        container.bottom = offset.top + container.height;

        var dropdown = {
            height: this.$dropdown.outerHeight(false)
        };

        var viewport = {
            top: $window.scrollTop(),
            bottom: $window.scrollTop() + $window.height()
        };

        var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
        var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

        var css = {
            left: offset.left,
            top: container.bottom
        };

        // Determine what the parent element is to use for calciulating the offset
        var $offsetParent = this.$dropdownParent;

        // For statically positoned elements, we need to get the element
        // that is determining the offset
        if ($offsetParent.css('position') === 'static') {
            $offsetParent = $offsetParent.offsetParent();
        }

        var parentOffset = $offsetParent.offset();

        css.top -= parentOffset.top
        css.left -= parentOffset.left;

        var dropdownPositionOption = this.options.get('dropdownPosition');

        if (dropdownPositionOption === 'above' || dropdownPositionOption === 'below') {
            newDirection = dropdownPositionOption;
        } else {
            if (!isCurrentlyAbove && !isCurrentlyBelow) {
                newDirection = 'below';
            }

            if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
                newDirection = 'above';
            } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
                newDirection = 'below';
            }
        }

        if (newDirection == 'above' || (isCurrentlyAbove && newDirection !== 'below')) {
            css.top = container.top - parentOffset.top - dropdown.height;
        }

        if (newDirection != null) {
          this.$dropdown
            .removeClass('select2-dropdown--below select2-dropdown--above')
            .addClass('select2-dropdown--' + newDirection);
          this.$container
            .removeClass('select2-container--below select2-container--above')
            .addClass('select2-container--' + newDirection);
        }

        this.$dropdownContainer.css(css);
    };
}

let body = $('body');

const openMobileMenu = function() {
    let mobileMenu = $('.header__bottom');

    mobileMenu.addClass('header__bottom--open');
    body.addClass('fixed');
}

const closeMobileMenu = function() {
    let mobileMenu = $('.header__bottom');

    mobileMenu.removeClass('header__bottom--open');
    body.removeClass('fixed');
}

$(function() {
    //мобильное меню:
    let openMenuBtn = $('.header__mobile-btn--open'),
        closeMenuBtn = $('.header__mobile-btn--close');

    openMenuBtn.on('click', function() {
        openMobileMenu();
    });

    closeMenuBtn.on('click', function() {
        closeMobileMenu();
    });

    //поиск в шапке:
    let openSearchBtn = $('.header-search__trap'),
        closeSearchBtn = $('.header-search__close'),
        searchScreen = $('.header-search__overlay');

    const openHeaderSearch = function() {
        searchScreen.addClass('header-search__overlay--open');
        body.addClass('fixed');
    }

    const closeHeaderSearch = function() {
        searchScreen.removeClass('header-search__overlay--open');
        body.removeClass('fixed');
    }

    openSearchBtn.on('click', function() {
        openHeaderSearch();
    });

    body.on('mouseup touchend', function(e) {
        if (searchScreen.is(e.target) || closeSearchBtn.is(e.target)) {
            closeHeaderSearch();
        }
    });

    //Замена фона в баннере:
    // swapBannerBG();

    //слайдер коллекций на главной:
    let collectionSlider = $('.index-catalog--slider .slider__slider:not(.slick-initialized)');

    if (collectionSlider.length) {
        collectionSlider.slick({
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            prevArrow: collectionSlider.closest('.index-catalog--slider').find('.slider__arrow--prev'),
            nextArrow: collectionSlider.closest('.index-catalog--slider').find('.slider__arrow--next'),
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                        infinite: true,
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        infinite: true,
                    }
                },
            ]
        });
    }

    //слайдер лидеров продаж:
    let hitsSlider = $('.hits .slider__slider:not(.slick-initialized)');

    if (hitsSlider.length) {
        hitsSlider.slick({
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 1,
            centerMode: false,
            prevArrow: hitsSlider.closest('.hits').find('.slider__arrow--prev'),
            nextArrow: hitsSlider.closest('.hits').find('.slider__arrow--next'),
            responsive: [
                {
                    breakpoint: 1599,
                    settings: {
                        slidesToShow: 4,
                        infinite: false,
                        centerMode: false,
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 3,
                        infinite: true,
                        centerMode: true,
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        infinite: true,
                        centerMode: true,
                    }
                },
                {
                    breakpoint: 699,
                    settings: {
                        slidesToShow: 1,
                        infinite: true,
                        centerMode: true,
                        variableWidth: true,
                    }
                },
            ]
        });
    }

    //"добавление" в избранное (УДАЛИТЬ ПОСЛЕ ПЕРЕНОСА!!!):
    let productFavBtns = $('.product__fav');

    productFavBtns.on('click', function() {
        $(this).toggleClass('product__fav--active');
        $(this).blur();
    });

    //открытие модалок по ajax:
    body.on('click', '[data-ajax=""]', function(e) {
        e.preventDefault();

        let ajaxCallBtn = $(this),
            link = ajaxCallBtn.data('link');

        if (link) {
            closeMobileMenu();
            closeHeaderSearch();
            closeModals();

            body.addClass('fixed');

            $.ajax({
                type: 'GET',
                url: link,
                dataType: 'html',
                success: function(data) {
                    body.append($(data));
                },
                complete: function() {
                    // $('.tabs-links__link').removeClass('loading');
                },
                error: function() {
                    console.log('error: request failed');
                }
            });
        } else {
            console.log('error: no link');
        }
    });

    //закрытие модалок:
    const closeModals = function() {
        body.find('.default-modal').remove();
        body.removeClass('fixed');
    }

    body.on('click', '.default-modal__close-btn', function() {
        closeModals();
    });

    body.on('click', '.default-modal', function(e) {
        if (!$('.default-modal__body').is(e.target) && $('.default-modal__body').has(e.target).length === 0) {
            closeModals();
        }
    });

    $(document).on('keyup', function(e) {
        if (e.keyCode == 27 && body.find('.default-modal').length) {
            closeModals();
        }
    });

    //карта в контактах:
    var contactsMap = $('#contacts-map');
    if (contactsMap.length) {
        ymaps.ready(function () {
            var myMap = new ymaps.Map('contacts-map', {
                center: [59.717327, 30.394686],
                zoom: 16
            }, {
                searchControlProvider: 'yandex#search'
            }),

            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
            ),

            myPlacemarkWithContent = new ymaps.Placemark([59.717327, 30.394686], {
                hintContent: 'hintContent',
                balloonContent: 'balloonContent',
            }, {
                iconLayout: 'default#imageWithContent',
                iconImageHref: 'img/icon-map-pin.svg',
                iconImageSize: [54, 54],
                iconImageOffset: [-27, -27],
                iconContentOffset: [0, 0],
                iconContentLayout: MyIconContentLayout
            });

            myMap.geoObjects.add(myPlacemarkWithContent);
            myMap.controls.remove('rulerControl');
            myMap.controls.remove('searchControl');
            myMap.controls.remove('trafficControl');
            myMap.controls.remove('typeSelector');
            myMap.controls.remove('zoomControl');
            myMap.controls.remove('geolocationControl');
            myMap.controls.remove('routeEditor');
        });
    }

    //маски в формах:
    let phoneInputs = $('input[name="PHONE"]'),
        emailInputs = $('input[name="EMAIL"]'),
        zipInputs = $('input[name="ZIP"]');

    if (phoneInputs.length) {
        phoneInputs.inputmask({
            'mask': '+9(999)999-99-99',
            'clearIncomplete': true,
            'greedy': false,
        });
    }

    // if (emailInputs.length) {
    //     emailInputs.inputmask({
    //         'mask': '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
    //         'greedy': false,
    //         'onBeforePaste': function (pastedValue, opts) {
    //             pastedValue = pastedValue.toLowerCase();
    //             return pastedValue.replace('mailto:', '');
    //         },
    //         'definitions': {
    //             '*': {
    //                 'validator': '[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]',
    //                 'casing': 'lower'
    //            }
    //         }
    //     });
    // }

    if (zipInputs.length) {
        zipInputs.inputmask({
            'mask': '999999',
            'placeholder': '______',
            'clearIncomplete': true,
            'greedy': false,
        });
    }

    //кастомные селекты в стандартной форме:
    let formSelects = $('.form__select');

    if (formSelects.length) {
        modifySelect2();

        formSelects.each(function() {
            let select = $(this),
                placeholder = select.data('placeholder');

            select.select2({
                'placeholder': placeholder,
                'minimumResultsForSearch': -1,
                'dropdownPosition': 'below',
                'width': 'auto',
            });
        });
    }

    //переключение полей при смене выбора доставки в оформлении заказа (УДАЛИТЬ ПОСЛЕ ПЕРЕНОСА!!!):
    let deliveryRadio = $('input[name="DELIVERY"]');

    deliveryRadio.on('change', function() {
        let selectedOption = $(this),
            deliveryType = selectedOption.val(),
            fieldsForSelf = $('.form__input-label[data-for-delivery="self"]'),
            fieldsForDelivery = $('.form__input-label[data-for-delivery="delivery"]'),
            classForHidden = 'form__input-label--hidden';

        if (deliveryType == 'self') {
            fieldsForDelivery.addClass(classForHidden);
            fieldsForSelf.removeClass(classForHidden);
        } else {
            fieldsForDelivery.removeClass(classForHidden);
            fieldsForSelf.addClass(classForHidden);
        }
    });

    //кастомные селекты в фильтрах каталога:
    let filterSelects = $('.catalog-filter__filter--select');

    if (filterSelects.length) {
        modifySelect2();

        filterSelects.each(function() {
            let select = $(this),
                placeholder = select.data('placeholder');

            select.select2({
                'placeholder': placeholder,
                'minimumResultsForSearch': -1,
                'dropdownPosition': 'below',
                'width': 'auto',
                'dropdownCssClass': 'catalog-filter__filter-select-dropdown',
                'templateSelection': function(element) {
                    if (element.id.length)
                        return placeholder + ': ' + element.text;
                    else
                        return placeholder;
                }
            });

            select.on('select2:select', function () {
                select.closest('.catalog-filter__filters').find('.catalog-filter__filter-reset').removeClass('catalog-filter__filter-reset--hidden');
            });
        });

        $('.catalog-filter__filter-reset').on('click', function(e) {
            e.preventDefault();
            filterSelects.val(null).trigger('change');
            $(this).addClass('catalog-filter__filter-reset--hidden');
        })
    }

    //удаление выбранных пунктов в фильтре:
    let chosenFilterItems = $('.catalog-filter__chosen-item');

    chosenFilterItems.each(function() {
        let item = $(this),
            itemRemoveBtn = item.find('.catalog-filter__chosen-item-remove');

        itemRemoveBtn.on('click', function() {
            item.remove();
        });
    });

    //кол-во товара в корзине (УДАЛИТЬ ПОСЛЕ ПЕРЕНОСА?):
    let goodsCartCounterBlocks = $('.cart__item-quantity');
    const changeQuantity = function(elem) {
        let counterInput = elem.closest('.cart__item-quantity').find('.item-quantity-field'),
            currentQuantity = parseInt(counterInput.val()),
            minQuantity = counterInput.prop('min'),
            maxQuantity = counterInput.prop('max'),
            newQuantity = 0;

        if (elem.hasClass('cart__item-quantity-btn--minus')) {
            newQuantity = currentQuantity - 1;

            if (newQuantity < minQuantity) {
                return false;
            } else {
                counterInput.prop('value', newQuantity);
                console.log(newQuantity);
            }
        } else if (elem.hasClass('cart__item-quantity-btn--plus')) {
            newQuantity = currentQuantity + 1;

            if (newQuantity > maxQuantity) {
                return false;
            } else {
                counterInput.prop('value', newQuantity);
                console.log(newQuantity);
            }
        } else {
            return false;
        }
    }

    goodsCartCounterBlocks.each(function() {
        let counterBlock = $(this),
            counterInput = counterBlock.find('.item-quantity-field'),
            counterBtn = counterBlock.find('.cart__item-quantity-btn');

        counterBtn.on('click', function() {
            changeQuantity($(this));
        });
    });

    //удаление товара из корзины (УДАЛИТЬ ПОСЛЕ ПЕРЕНОСА?):
    let cartItems = $('.cart__table-row');

    cartItems.each(function() {
        let item = $(this),
            removeBtn = item.find('.cart__item-remove-btn'),
            restoreHtml = '<td class="cart__table-cell cart__table-cell--restore">\n'+
                              '<span class="cart__restore-text">Товар был удален из корзины</span>\n'+
                              '<button class="cart__restore-btn btn btn--secondary btn--cart-restore">Восстановить</button>\n'+
                          '</td>';

        removeBtn.on('click', function() {
            item.find('.cart__table-cell--quantity').remove();
            item.find('.cart__table-cell--price').remove();
            item.find('.cart__table-cell--remove').remove();

            item.append(restoreHtml);
        });
    });

    //основной слайдер в карточке товара:
    let productSlider = $('.product-sliders__slider-items:not(.slick-initialized)');

    if (productSlider.length) {
        let productThumbSlider = $('.product-sliders__thumb-slider-items:not(.slick-initialized)');

        productSlider.slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            arrows: false,
            dots: false,
            asNavFor: '.product-sliders__thumb-slider-items',
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        dots: true,
                    }
                },
            ]
        });

        if (productThumbSlider.length) {
            productThumbSlider.slick({
                infinite: false,
                slidesToShow: 4,
                slidesToScroll: 1,
                // centerMode: true,
                arrows: false,
                dots: false,
                // variableWidth: true,
                asNavFor: '.product-sliders__slider-items',
                focusOnSelect: true,
                responsive: [
                    {
                        breakpoint: 1599,
                        settings: {
                            slidesToShow: 3,
                        }
                    },
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                ]
            });
        }
    }

    //"переключение" SKU в карточке (УДАЛИТЬ ПОСЛЕ ПЕРЕНОСА!!!):
    let skuBtns = $('.catalog-element__sku-block-option');

    skuBtns.on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('catalog-element__sku-block-option--active')) {
            skuBtns.removeClass('catalog-element__sku-block-option--active');
            $(this).addClass('catalog-element__sku-block-option--active');
        }
    });

    //аккордеон с описанием товара в карточке:
    let productDescToggles = $('.catalog-element__description-head, .catalog-element__description-toggle');

    productDescToggles.on('click', function() {
        let descBlock = $(this).closest('.catalog-element__description'),
            descText = descBlock.find('.catalog-element__description-body');

        descBlock.toggleClass('catalog-element__description--closed');
        descText.slideToggle(200);
    });
});

$(window).on('resize', function() {
    //закрытие моб. меню при переходе на широкий экран:
    if ($(window).width() >= 1200 && $('.header__bottom').hasClass('header__bottom--open')) {
        closeMobileMenu();
    }
});
