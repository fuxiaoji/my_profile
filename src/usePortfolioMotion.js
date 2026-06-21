import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePortfolioMotion(scope, pathname, openingVariant = 'v1', routeKey = '') {
  useLayoutEffect(() => {
    if (!scope.current) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    resetScroll()
    window.requestAnimationFrame(() => window.requestAnimationFrame(resetScroll))
    const resetTimer = window.setTimeout(resetScroll, 120)

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set('.opening, .route-curtain', { display: 'none' })
        return
      }

      if (pathname !== '/') {
        gsap.timeline()
          .set('.route-curtain', { display: 'flex', clipPath: 'inset(100% 0 0 0)' })
          .set('.route-curtain span', { yPercent: 120 })
          .to('.route-curtain', { clipPath: 'inset(0% 0 0 0)', duration: .5, ease: 'power4.inOut' })
          .to('.route-curtain span', { yPercent: 0, duration: .45, ease: 'power3.out' }, '-=.2')
          .to('.route-curtain span', { yPercent: -120, duration: .35, ease: 'power3.in' }, '+=.1')
          .to('.route-curtain', { clipPath: 'inset(0 0 100% 0)', duration: .72, ease: 'power4.inOut' }, '-=.1')
          .set('.route-curtain', { display: 'none' })
      } else {
        gsap.set('.route-curtain', { display: 'none' })
      }

      if (pathname === '/') {
        const counter = { value: 0 }
        document.body.style.overflow = 'hidden'
        const intro = gsap.timeline({ defaults: { ease: 'power4.inOut' }, onComplete: () => { document.body.style.overflow = '' } })
        const updateCounter = () => {
          const node = document.querySelector('.opening-count')
          if (node) node.textContent = String(Math.round(counter.value)).padStart(3, '0')
        }
        intro
          .set('.opening', { display: 'grid', autoAlpha: 1 })
          .set('.opening-compare', { autoAlpha: 0, y: 12 })
          .set('.opening-panel', { scaleY: 1 })
          .set('.opening-label span', { yPercent: 120 })
          .set('.opening-count', { autoAlpha: 1 })
          .set('.hero h1 span', { yPercent: 125, scaleX: .68, transformOrigin: 'left bottom' })
          .set('.hero-watermark', { xPercent: 24, autoAlpha: 0 })
          .set('.hero-top > *, .hero-bottom > *', { y: 30, autoAlpha: 0 })

        if (openingVariant === 'v1') {
          intro
            .to(counter, { value: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: updateCounter }, 0)
            .to('.opening-label span', { yPercent: 0, duration: .75 }, .15)
            .to('.opening-panel', { scaleY: 0, transformOrigin: 'top', duration: 1.15, stagger: .08 }, 1.75)
            .to('.opening-count, .opening-label', { autoAlpha: 0, y: -14, duration: .4 }, 2.35)
            .to('.opening', { autoAlpha: 0, duration: .01 }, 2.98)
            .to('.hero-watermark', { xPercent: 0, autoAlpha: 1, duration: 1.4, ease: 'power3.out' }, 2.02)
            .to('.hero h1 span', { yPercent: 0, scaleX: 1, duration: 1.35, stagger: .12 }, 2.1)
            .to('.hero-top > *, .hero-bottom > *', { y: 0, autoAlpha: 1, duration: .9, stagger: .08 }, 2.65)
            .to('.opening-compare', { autoAlpha: 1, y: 0, duration: .45, ease: 'power3.out' }, 3.35)
        } else {
          intro
            .set('.opening-kicker span', { yPercent: -140, autoAlpha: 0 })
            .set('.opening-cn span', { yPercent: 115, scaleX: .7, autoAlpha: 0, transformOrigin: 'center bottom' })
            .set('.opening-rule', { scaleX: 0 })
            .to(counter, { value: 100, duration: 2.65, ease: 'power2.inOut', onUpdate: updateCounter }, 0)
            .to('.opening-kicker span', { yPercent: 0, autoAlpha: 1, duration: .7, stagger: .1, ease: 'power3.out' }, .12)
            .to('.opening-cn span', { yPercent: 0, scaleX: 1, autoAlpha: 1, duration: 1.3, ease: 'power4.out' }, .28)
            .to('.opening-label span', { yPercent: 0, duration: .7 }, .72)
            .to('.opening-rule', { scaleX: 1, duration: 1.35, ease: 'power3.inOut' }, .65)
            .to('.opening-cn span', { xPercent: 16, yPercent: -18, scaleX: .82, autoAlpha: .34, duration: .85, ease: 'power3.inOut' }, 1.58)
            .to('.opening-panel', { scaleY: 0, duration: 1.4, stagger: { each: .12, from: 'center' }, ease: 'power4.inOut' }, 2.18)
            .to('.opening-kicker, .opening-cn, .opening-rule, .opening-count, .opening-label', { autoAlpha: 0, y: -18, duration: .5, stagger: .025 }, 2.48)
            .to('.opening', { autoAlpha: 0, duration: .01 }, 3.78)
            .to('.hero-watermark', { xPercent: 0, autoAlpha: 1, duration: 1.5, ease: 'power3.out' }, 2.48)
            .to('.hero h1 span', { yPercent: 0, scaleX: 1, duration: 1.5, stagger: .14, ease: 'power4.out' }, 2.62)
            .to('.hero-top > *, .hero-bottom > *', { y: 0, autoAlpha: 1, duration: .95, stagger: .08 }, 3.12)
            .to('.opening-compare', { autoAlpha: 1, y: 0, duration: .45, ease: 'power3.out' }, 3.92)
        }

        gsap.fromTo('.manifesto-copy', { xPercent: -12, scaleX: .78 }, {
          xPercent: 0, scaleX: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.manifesto', start: 'top 78%', end: 'center 55%', scrub: 1.3 },
        })

        gsap.utils.toArray('.section-heading').forEach((heading) => {
          gsap.fromTo(heading.querySelector('h2'), { yPercent: 70, skewY: 7, clipPath: 'inset(0 0 100% 0)' }, {
            yPercent: 0, skewY: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.55, ease: 'power4.out',
            scrollTrigger: { trigger: heading, start: 'top 82%' },
            clearProps: 'clipPath',
          })
        })

        gsap.fromTo('.home-project-tile', { y: 90, scale: .88, rotate: (index) => index % 2 ? 3 : -3, autoAlpha: 0 }, {
          y: 0, scale: 1, rotate: 0, autoAlpha: 1, duration: 1.25, stagger: .13, ease: 'power4.out',
          scrollTrigger: { trigger: '.home-project-mosaic', start: 'top 76%' },
        })

        gsap.utils.toArray('.project-card').forEach((card) => {
          const visual = card.querySelector('.project-visual')
          const body = card.querySelector('.project-body')
          gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 78%' } })
            .fromTo(visual, { clipPath: 'inset(100% 0 0 0)', scale: .96 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.45, ease: 'power4.out' })
            .fromTo(body.children, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: .1, ease: 'power3.out' }, '-=.8')
          gsap.to(card.querySelector('.orb'), { yPercent: -18, rotate: card.matches(':nth-child(3)') ? 38 : 8, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
        })

        gsap.fromTo('.profile-grid > *', { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .18, duration: 1.25, ease: 'power4.out', scrollTrigger: { trigger: '.profile-grid', start: 'top 78%' } })
        gsap.to('.portrait img', { yPercent: -16, ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'bottom top', scrub: 1.1 } })
        if (window.matchMedia('(min-width: 701px)').matches) {
          const photoTrack = document.querySelector('.photo-track')
          const photoDistance = () => Math.max(1, photoTrack.scrollWidth - window.innerWidth + window.innerWidth * .08)
          gsap.to(photoTrack, {
            x: () => -photoDistance(),
            ease: 'none',
            scrollTrigger: { trigger: '.photo-section', start: 'top top', end: () => `+=${photoDistance()}`, scrub: 1.25, pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true },
          })
          gsap.fromTo('.photo-frame', { clipPath: 'inset(0 0 100% 0)', yPercent: 12 }, { clipPath: 'inset(0 0 0% 0)', yPercent: 0, duration: 1.3, stagger: .07, ease: 'power4.out', scrollTrigger: { trigger: '.photo-section', start: 'top 68%' } })
          gsap.utils.toArray('.photo-frame img').forEach((image, index) => gsap.to(image, { yPercent: -12 - (index % 3) * 3, ease: 'none', scrollTrigger: { trigger: '.photo-section', start: 'top top', end: () => `+=${photoDistance()}`, scrub: 1.4 } }))
        }
        gsap.fromTo('.capabilities-section article', { xPercent: -16, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, stagger: .12, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.capabilities-section', start: 'top 58%' } })
        gsap.fromTo('.awards-strip article', { y: 90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .12, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: '.awards-strip', start: 'top 82%' } })
        gsap.fromTo('.home-article-card, .library-actions > a', { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .1, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.home-article-cards', start: 'top 78%' } })
        gsap.fromTo('.contact-section h2', { xPercent: -20, scaleX: .7 }, { xPercent: 0, scaleX: 1, transformOrigin: 'left center', ease: 'power3.out', scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'center 55%', scrub: 1.4 } })
      } else {
        gsap.fromTo('.index-hero h1', { yPercent: 70, scaleX: .74, clipPath: 'inset(0 0 100% 0)' }, { yPercent: 0, scaleX: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power4.out', delay: .25, clearProps: 'clipPath' })
        const indexItems = gsap.utils.toArray('.content-index > a, .notes-grid > a')
        if (indexItems.length) gsap.fromTo(indexItems, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, stagger: .045, ease: 'power3.out', delay: .5 })
      }
    }, scope)

    return () => {
      window.clearTimeout(resetTimer)
      document.body.style.overflow = ''
      context.revert()
    }
  }, [pathname, openingVariant, routeKey, scope])
}
