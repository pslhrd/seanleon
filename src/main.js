import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import LocomotiveScroll from 'locomotive-scroll'
import barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'
// import Cursor from './cursor'
import imagesLoaded from 'imagesloaded'

gsap.registerPlugin(ScrollToPlugin)

const body = document.body

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i)
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
  }
}

if (isMobile.any() === null) {
  console.log('Not Mobile')
} else {
  console.log(isMobile.any())
}

function smooth(container) {
  scroll = new LocomotiveScroll({
    el: container.querySelector('[data-scroll-container]'),
    smooth: true,
    smoothMobile: false,
  });
}

function homeLaunch() {
	smooth(body)
}


function drawMenu() {
  const wrapper = document.querySelector('.menu-wrapper')
  const height = document.querySelector('.menu-wrapper').clientHeight
  const menu = document.querySelector('.open')
  const close = document.querySelector('.close')
  const main = document.querySelector('main')

  const tl = gsap.timeline()
  const tl2 = gsap.timeline()

  menu.addEventListener('click', e => {
    tl
    .set(wrapper, {display:'block'})
    .to('.menu-wrapper', {autoAlpha:1, duration:0.5, ease:'power4.out'})
    .fromTo('.menu-wrapper a', {y:'100%'}, {y:'0%', duration:0.6, ease:'power3.out', stagger:0.1}, '-=0.3')
    close.style.display = 'block'
    menu.style.display = 'none'
    main.style.overflow = 'hidden'
  })

  close.addEventListener('click', e => {
    tl
    .to('.menu-wrapper', {autoAlpha:0, duration:0.5, ease:'power3.out'})
    .set(wrapper, {display:'none'})
    main.style.overflow = 'visible'
    close.style.display = 'none'
    menu.style.display = 'block'
  })
}

drawMenu()
homeLaunch()