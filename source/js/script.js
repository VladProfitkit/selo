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
});

$(window).on('resize', function() {
    //закрытие моб. меню при переходе на широкий экран:
    if ($(window).width() >= 1200 && $('.header__bottom').hasClass('header__bottom--open')) {
        closeMobileMenu();
    }

    //Замена фона в баннере:
    swapBannerBG();
});
