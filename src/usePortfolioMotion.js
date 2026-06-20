import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePortfolioMotion(scope, pathname) {
  useLayoutEffect(() => {
    if (!scope.current) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    window.requestAnimationFrame(() => window.scrollTo(0, 0))

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set('.opening, .route-curtain', { display: 'none' })
        return
      }

      gsap.timeline()
        .set('.route-curtain', { yPercent: 100 })
        .to('.route-curtain', { yPercent: 0, duration: .72, ease: 'power4.inOut' })
        .set('.route-curtain', { yPercent: -100 })
        .to('.route-curtain', { yPercent: -200, duration: .9, ease: 'power4.inOut' })

      if (pathname === '/') {
        const counter = { value: 0 }
        document.body.style.overflow = 'hidden'
        const intro = gsap.timeline({ defaults: { ease: 'power4.inOut' }, onComplete: () => { document.body.style.overflow = '' } })
        intro
          .set('.hero h1 span', { yPercent: 125, scaleX: .68, transformOrigin: 'left bottom' })
          .set('.hero-top > *, .hero-bottom > *', { y: 30, autoAlpha: 0 })
          .to(counter, { value: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => {
            const node = document.querySelector('.opening-count')
            if (node) node.textContent = String(Math.round(counter.value)).padStart(3, '0')
          } })
          .to('.opening-label span', { yPercent: 0, duration: .75 }, .15)
          .to('.opening-panel', { scaleY: 0, transformOrigin: 'top', duration: 1.15, stagger: .08 }, 1.75)
          .to('.opening', { autoAlpha: 0, duration: .01 })
          .to('.hero h1 span', { yPercent: 0, scaleX: 1, duration: 1.35, stagger: .12 }, 2.1)
          .to('.hero-top > *, .hero-bottom > *', { y: 0, autoAlpha: 1, duration: .9, stagger: .08 }, 2.65)

        gsap.fromTo('.manifesto-copy', { xPercent: -12, scaleX: .78 }, {
          xPercent: 0, scaleX: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.manifesto', start: 'top 78%', end: 'center 55%', scrub: 1.3 },
        })

        gsap.utils.toArray('.section-heading').forEach((heading) => {
          gsap.fromTo(heading.querySelector('h2'), { yPercent: 70, skewY: 7, clipPath: 'inset(0 0 100% 0)' }, {
            yPercent: 0, skewY: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.55, ease: 'power4.out',
            scrollTrigger: { trigger: heading, start: 'top 82%' },
          })
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
        if (window.matchMedia('(min-width: 801px)').matches) {
          const photoTrack = document.querySelector('.photo-track')
          gsap.to(photoTrack, {
            x: () => -(photoTrack.scrollWidth - window.innerWidth + window.innerWidth * .08),
            ease: 'none',
            scrollTrigger: { trigger: '.photo-section', start: 'top top', end: 'bottom bottom', scrub: 1.25, invalidateOnRefresh: true },
          })
          gsap.fromTo('.photo-frame', { clipPath: 'inset(0 0 100% 0)', yPercent: 12 }, { clipPath: 'inset(0 0 0% 0)', yPercent: 0, duration: 1.3, stagger: .07, ease: 'power4.out', scrollTrigger: { trigger: '.photo-section', start: 'top 68%' } })
          gsap.utils.toArray('.photo-frame img').forEach((image, index) => gsap.to(image, { yPercent: -12 - (index % 3) * 3, ease: 'none', scrollTrigger: { trigger: '.photo-section', start: 'top top', end: 'bottom bottom', scrub: 1.4 } }))
        }
        gsap.fromTo('.capabilities-section article', { xPercent: -16, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, stagger: .12, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.capabilities-section', start: 'top 58%' } })
        gsap.fromTo('.awards-grid article', { y: 120, scale: .94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, stagger: .16, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.awards-grid', start: 'top 78%' } })
        gsap.fromTo('.contact-section h2', { xPercent: -20, scaleX: .7 }, { xPercent: 0, scaleX: 1, transformOrigin: 'left center', ease: 'power3.out', scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'center 55%', scrub: 1.4 } })
      } else {
        gsap.fromTo('.writing-hero h1', { yPercent: 80, scaleX: .72, clipPath: 'inset(0 0 100% 0)' }, { yPercent: 0, scaleX: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power4.out', delay: .35 })
        const articleLinks = gsap.utils.toArray('.article-index a')
        if (articleLinks.length) gsap.fromTo(articleLinks, { x: -90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.article-index', start: 'top 82%' } })
      }
    }, scope)

    return () => {
      document.body.style.overflow = ''
      context.revert()
    }
  }, [pathname, scope])
}
