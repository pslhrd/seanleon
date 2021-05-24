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

homeLaunch()