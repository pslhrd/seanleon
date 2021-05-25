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

const tl = gsap.timeline()

barba.init({
  debug: true,
  transitions: [{
    name: 'opacity-transition',
    beforeEnter({ next }) { 
      scroll.destroy()
      smooth(next.container)
    },
    leave(data) {
      if (isMobile.any()) {
        gsap.set(window, {scrollTo: 0})
      }
      document.querySelector('.transition').style.transformOrigin = 'bottom'
      gsap.to('.transition', {scaleY:1, duration:1, ease:'power3.inOut'})
      gsap.to(data.current.container, {y:'-2%', duration:1, ease:'power3.inOut'})
      return gsap.to(data.current.container, {opacity: 0,duration:0.6,ease:'power3.inOut'})
    },
    enter(data) {
      data.current.container.style.display = 'none';
      document.querySelector('.transition').style.transformOrigin = 'top'
      scroll.update()
      gsap.to('.transition', {scaleY:0, duration:0.8, ease:'power3.out'})
      gsap.from(data.next.container, {y:'2%', duration:1, ease:'power3.out'})
      return gsap.from(data.next.container, {opacity: 0,duration:0.5,ease:'power3.inOut'})
    }
  }]
});

homeLaunch()