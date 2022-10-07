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

const swapBannerBG = function() {
    let bannerSection = $('.index-banner'),
        mobileBG = bannerSection.data('bg-mobile'),
        desktopBG = bannerSection.data('bg-desktop');

    if ($(window).width() < 768) {
        bannerSection.css('background-image', 'url('+mobileBG+')');
    } else {
        bannerSection.css('background-image', 'url('+desktopBG+')');
    }
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
    swapBannerBG();

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
});

$(window).on('resize', function() {
    //закрытие моб. меню при переходе на широкий экран:
    if ($(window).width() >= 1200 && $('.header__bottom').hasClass('header__bottom--open')) {
        closeMobileMenu();
    }

    //Замена фона в баннере:
    swapBannerBG();
});
