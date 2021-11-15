$(document).ready(function () {
    const $cont = $('.cont');
    const $slider = $('.slider');
    const $nav = $('.nav');
    const winW = $(window).width();
    const animSpd = 750; // Change also in CSS
    const distOfLetGo = winW * 0.2;
    let curSlide = 1;
    let animation = false;
    let autoScrollVar = true;
    let diff = 0;
  
    // This script creates the slides using arrays, and let commands.
    let arrHeadsets = ['Quest', 'Rift', 'Index', 'Pimax', 'PSVR'];
    let numOfHeadsets = arrHeadsets.length;
    let arrHeadsetsDivided = [];
  
    arrHeadsets.map(headset => {
      let length = headset.length;
      let letters = Math.floor(length / 4);
      let exp = new RegExp(".{1," + letters + "}", "g");
  
      arrHeadsetsDivided.push(headset.match(exp));
    });
  
    let generateSlide = function (headset) {
      let frag1 = $(document.createDocumentFragment());
      let frag2 = $(document.createDocumentFragment());
      const numSlide = arrHeadsets.indexOf(arrHeadsets[headset]) + 1;
      const firstLetter = arrHeadsetsDivided[headset][0].charAt(0);
  
      const $slide =
      $(`<div data-target="${numSlide}" class="slide slide--${numSlide}">
                              <div class="slide__darkbg slide--${numSlide}__darkbg"></div>
                              <div class="slide__text-wrapper slide--${numSlide}__text-wrapper"></div>
                          </div>`);
  
      const letter =
      $(`<div class="slide__letter slide--${numSlide}__letter">
                              ${firstLetter}
                          </div>`);
  
      for (let i = 0, length = arrHeadsetsDivided[headset].length; i < length; i++) {
        const text =
        $(`<div class="slide__text slide__text--${i + 1}">
                                  ${arrHeadsetsDivided[headset][i]}
                              </div>`);
        frag1.append(text);
      }
  
      const navSlide = $(`<li data-target="${numSlide}" class="nav__slide nav__slide--${numSlide}"></li>`);
      frag2.append(navSlide);
      $nav.append(frag2);
  
      $slide.find(`.slide--${numSlide}__text-wrapper`).append(letter).append(frag1);
      $slider.append($slide);
  
      if (arrHeadsets[headset].length <= 4) {
        $('.slide--' + numSlide).find('.slide__text').css("font-size", "12vw");
      }
    };
  
    for (let i = 0, length = numOfHeadsets; i < length; i++) {
      generateSlide(i);
    }
  
    $('.nav__slide--1').addClass('nav-active');
  
    // Nav Bullets Event Stuff - This ends up breaking, but Im still including it as code that worked at some point in the process.
    function bullets(dir) {
      $('.nav__slide--' + dir).addClass('nav-active');
      $('.nav__slide--' + curSlide).removeClass('nav-active');
    }
  
    function timeout() {
      animation = false;
    }
  
    function pagination(direction) {
      animation = true;
      diff = 0;
      $slider.addClass('animation');
      $slider.css({
        'transform': 'translate3d(-' + (curSlide - direction) * 100 + '%, 0, 0)' });
  
  
      $slider.find('.slide__darkbg').css({
        'transform': 'translate3d(' + (curSlide - direction) * 50 + '%, 0, 0)' });
  
  
      $slider.find('.slide__letter').css({
        'transform': 'translate3d(0, 0, 0)' });
  
  
      $slider.find('.slide__text').css({
        'transform': 'translate3d(0, 0, 0)' });
  
    }
  
    function navigateRight() {
      if (!autoScrollVar) return;
      if (curSlide >= numOfHeadsets) return;
      pagination(0);
      setTimeout(timeout, animSpd);
      bullets(curSlide + 1);
      curSlide++;
    }
  
    function navigateLeft() {
      if (curSlide <= 1) return;
      pagination(2);
      setTimeout(timeout, animSpd);
      bullets(curSlide - 1);
      curSlide--;
    }
  
    function toDefault() {
      pagination(1);
      setTimeout(timeout, animSpd);
    }
  
    // Big Arrows Event Listner things
    $(document).on('mousedown touchstart', '.slide', function (e) {
      if (animation) return;
      let target = +$(this).attr('data-target');
      let startX = e.pageX || e.originalEvent.touches[0].pageX;
      $slider.removeClass('animation');
  
      $(document).on('mousemove touchmove', function (e) {
        let x = e.pageX || e.originalEvent.touches[0].pageX;
        diff = startX - x;
        if (target === 1 && diff < 0 || target === numOfHeadsets && diff > 0) return;
  
        $slider.css({
          'transform': 'translate3d(-' + ((curSlide - 1) * 100 + diff / 30) + '%, 0, 0)' });
  
  
        $slider.find('.slide__darkbg').css({
          'transform': 'translate3d(' + ((curSlide - 1) * 50 + diff / 60) + '%, 0, 0)' });
  
  
        $slider.find('.slide__letter').css({
          'transform': 'translate3d(' + diff / 60 + 'vw, 0, 0)' });
  
  
        $slider.find('.slide__text').css({
          'transform': 'translate3d(' + diff / 15 + 'px, 0, 0)' });
  
      });
    });
  
    $(document).on('mouseup touchend', function (e) {
      $(document).off('mousemove touchmove');
  
      if (animation) return;
  
      if (diff >= distOfLetGo) {
        navigateRight();
      } else if (diff <= -distOfLetGo) {
        navigateLeft();
      } else {
        toDefault();
      }
    });
  
    $(document).on('click', '.nav__slide:not(.nav-active)', function () {
      let target = +$(this).attr('data-target');
      bullets(target);
      curSlide = target;
      pagination(1);
    });
  
    $(document).on('click', '.side-nav', function () {
      let target = $(this).attr('data-target');
  
      if (target === 'right') navigateRight();
      if (target === 'left') navigateLeft();
    });
  
    $(document).on('keydown', function (e) {
      if (e.which === 39) navigateRight();
      if (e.which === 37) navigateLeft();
    });
  
    $(document).on('mousewheel DOMMouseScroll', function (e) {
      if (animation) return;
      let delta = e.originalEvent.wheelDelta;
  
      if (delta < 0 || e.originalEvent.detail > 0) navigateRight();
      if (delta > 0 || e.originalEvent.detail < 0) navigateLeft();
    });
  });