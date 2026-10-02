document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = initLenis(reduceMotion);

    initAnchorScroll(lenis);
    initHeroIntro(reduceMotion);
    initScrollArrow(reduceMotion);
    initMobileMenu(lenis, reduceMotion);
    initMindsetTypingAnimation(reduceMotion);
    initAboutProfileAnimation(reduceMotion);
    initSkillMarquee(reduceMotion);
    initFruenQrModal(lenis, reduceMotion);
    initProjectShowcaseAnimations(reduceMotion);
    const designGallerySlider = initDesignGallerySlider(reduceMotion);
    initDesignGalleryModal(lenis, reduceMotion, designGallerySlider);
    initSideProjectHorizontalScroll(reduceMotion);
    initContactEndingAnimation(reduceMotion);

    if (typeof ScrollTrigger !== "undefined") {
        window.addEventListener("load", () => {
            ScrollTrigger.refresh();
        }, { once: true });
    }
});

function initLenis(reduceMotion) {
    if (typeof Lenis === "undefined") {
        return null;
    }

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const lenis = new Lenis({
        duration: reduceMotion ? 0 : 1.08,
        lerp: reduceMotion ? 1 : 0.1,
        smoothWheel: !reduceMotion,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
        autoRaf: false,
    });

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    } else {
        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
    }

    return lenis;
}

function initAnchorScroll(lenis) {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const hash = link.getAttribute("href");

            if (!hash || hash === "#") {
                return;
            }

            const target = document.querySelector(hash);

            if (!target) {
                return;
            }

            event.preventDefault();

            if (lenis) {
                lenis.scrollTo(target);
                return;
            }

            target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

function initHeroIntro(reduceMotion) {
    const designer = document.querySelector(".hero__designer");
    const portfolio = document.querySelector(".hero__portfolio");

    if (!designer || !portfolio || typeof gsap === "undefined") {
        return;
    }

    if (reduceMotion) {
        gsap.set([designer, portfolio], { opacity: 1, y: 0 });
        return;
    }

    gsap.set([designer, portfolio], { opacity: 0, y: 50 });

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
        .to(designer, {
            opacity: 1,
            y: 0,
            duration: 1.4,
        })
        .to(
            portfolio,
            {
                opacity: 1,
                y: 0,
                duration: 1.45,
            },
            0.2
        );
}

function initScrollArrow(reduceMotion) {
    const arrow = document.querySelector(".hero__scroll-icon");

    if (!arrow) {
        return;
    }

    if (reduceMotion) {
        arrow.style.animation = "none";
    }
}

function initMobileMenu(lenis, reduceMotion) {
    const button = document.querySelector(".mobile-menu-button");
    const panel = document.querySelector("#mobile-menu");
    const links = panel ? panel.querySelectorAll(".mobile-menu__link") : [];
    const mobileQuery = window.matchMedia("(max-width: 402px)");

    if (!button || !panel) {
        return;
    }

    let isOpen = false;
    const duration = reduceMotion ? 0 : 0.8;
    const canAnimate = typeof gsap !== "undefined";

    if (canAnimate) {
        gsap.set(panel, { xPercent: 100 });
    }

    const setExpanded = (open) => {
        button.setAttribute("aria-expanded", open ? "true" : "false");
        button.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
        panel.setAttribute("aria-hidden", open ? "false" : "true");
        panel.classList.toggle("is-open", open);
        panel.style.pointerEvents = open ? "auto" : "none";
    };

    const slidePanel = (open) => {
        if (canAnimate) {
            gsap.to(panel, {
                xPercent: open ? 0 : 100,
                duration,
                ease: "power3.out",
                overwrite: true,
            });
            return;
        }

        panel.style.transform = open ? "translateX(0)" : "translateX(100%)";
    };

    const stopLenis = () => {
        if (lenis && typeof lenis.stop === "function") {
            lenis.stop();
        }
    };

    const startLenis = () => {
        if (lenis && typeof lenis.start === "function") {
            lenis.start();
        }
    };

    const openMenu = () => {
        if (isOpen) {
            return;
        }

        isOpen = true;
        setExpanded(true);
        stopLenis();
        slidePanel(true);
    };

    const closeMenu = () => {
        if (!isOpen) {
            return;
        }

        isOpen = false;
        setExpanded(false);
        startLenis();
        slidePanel(false);
    };

    button.addEventListener("click", () => {
        if (isOpen) {
            closeMenu();
            return;
        }

        openMenu();
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen) {
            closeMenu();
            button.focus();
        }
    });

    const handleViewportChange = (event) => {
        if (!event.matches && isOpen) {
            closeMenu();
        }
    };

    if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", handleViewportChange);
    } else {
        mobileQuery.addListener(handleViewportChange);
    }
}

function initMindsetTypingAnimation(reduceMotion) {
    const sections = document.querySelectorAll(".mindset-section");

    if (!sections.length) {
        return;
    }

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const buildLine = (element, text, complete) => {
        const chars = Array.from(text);

        element.textContent = "";
        element.setAttribute("aria-label", text);

        chars.forEach((char, index) => {
            const span = document.createElement("span");
            span.className = "typing-char";
            span.setAttribute("aria-hidden", "true");
            span.textContent = char === " " ? "\u00A0" : char;

            if (complete || index === 0) {
                span.classList.add("is-active");
            }

            element.appendChild(span);
        });

        if (complete) {
            return;
        }

        const cursor = document.createElement("span");
        cursor.className = "mindset-section__cursor";
        cursor.setAttribute("aria-hidden", "true");
        element.appendChild(cursor);
    };

    const updateLine = (element, activeCount) => {
        const chars = element.querySelectorAll(".typing-char");
        const cursor = element.querySelector(".mindset-section__cursor");

        chars.forEach((char, index) => {
            char.classList.toggle("is-active", index < activeCount);
        });

        if (!cursor || !chars.length) {
            return;
        }

        const lastActive = chars[Math.max(0, Math.min(activeCount, chars.length) - 1)];
        lastActive.after(cursor);
    };

    sections.forEach((section) => {
        const titleEn = section.querySelector(".mindset-section__title-en");
        const titleKo = section.querySelector(".mindset-section__title-ko");

        if (!titleEn || !titleKo) {
            return;
        }

        const textEn = titleEn.dataset.text || "";
        const textKo = titleKo.dataset.text || "";
        const enLength = Array.from(textEn).length;
        const koLength = Array.from(textKo).length;

        if (reduceMotion) {
            buildLine(titleEn, textEn, true);
            buildLine(titleKo, textKo, true);
            return;
        }

        buildLine(titleEn, textEn, false);
        buildLine(titleKo, textKo, false);
        updateLine(titleEn, 1);
        updateLine(titleKo, 1);

        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            return;
        }

        const fillable = Math.max(1, enLength - 1 + Math.max(0, koLength - 1));

        ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${fillable * 72}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const filled = Math.round(self.progress * fillable);
                const enActive = Math.min(enLength, 1 + Math.min(enLength - 1, filled));
                const koActive = Math.min(koLength, 1 + Math.max(0, filled - (enLength - 1)));

                updateLine(titleEn, enActive);
                updateLine(titleKo, koActive);
            },
        });
    });

    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }
}

function initAboutProfileAnimation(reduceMotion) {
    const section = document.querySelector(".about-profile");

    if (!section || typeof gsap === "undefined") {
        return;
    }

    const moreLink = section.querySelector(".about-profile__more");
    if (moreLink && moreLink.getAttribute("href") === "#") {
        moreLink.addEventListener("click", (event) => {
            event.preventDefault();
        });
    }

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const animate = (targets) => {
        if (!targets.length) {
            return;
        }

        if (reduceMotion) {
            gsap.set(targets, { opacity: 1, y: 0 });
            return;
        }

        gsap.fromTo(
            targets,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                    once: true,
                },
            }
        );
    };

    if (typeof gsap.matchMedia === "function") {
        const media = gsap.matchMedia();

        media.add("(min-width: 403px)", () => {
            animate(section.querySelectorAll(".about-profile__anim"));
        });

        media.add("(max-width: 402px)", () => {
            animate(
                section.querySelectorAll(
                    ".about-profile__anim:not(.about-profile__description)"
                )
            );
        });
    } else {
        animate(section.querySelectorAll(".about-profile__anim"));
    }

    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }
}

function initSkillMarquee(reduceMotion) {
    const wrapper = document.querySelector(".about-profile__skills");
    const track = document.querySelector(".skill-marquee__track");
    const group = track ? track.querySelector(".skill-marquee__group") : null;

    if (!wrapper || !track || !group || typeof gsap === "undefined") {
        return;
    }

    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);

    const startLoop = () => {
        const trackGap = Number.parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap) || 0;
        const distance = group.offsetWidth + trackGap;

        if (distance <= 100) {
            return;
        }

        gsap.set(track, { x: 0 });
        gsap.to(track, {
            x: -distance,
            duration: 30,
            ease: "none",
            repeat: -1,
        });
    };

    if (reduceMotion) {
        gsap.set(track, { x: 0 });
        return;
    }

    const images = wrapper.querySelectorAll("img");
    let pending = images.length;

    const maybeStart = () => {
        pending -= 1;

        if (pending <= 0) {
            startLoop();
        }
    };

    if (!images.length) {
        startLoop();
        return;
    }

    images.forEach((image) => {
        if (image.complete) {
            maybeStart();
            return;
        }

        image.addEventListener("load", maybeStart, { once: true });
        image.addEventListener("error", maybeStart, { once: true });
    });
}

function initFruenQrModal(lenis, reduceMotion) {
    const openButtons = document.querySelectorAll("[data-qr-open]");
    const modal = document.querySelector("#fruen-qr-modal");

    if (!openButtons.length || !modal) {
        return;
    }

    const panel = modal.querySelector(".qr-modal__panel");
    const backdrop = modal.querySelector(".qr-modal__backdrop");
    const codeImage = modal.querySelector(".qr-modal__code");
    const closeButtons = modal.querySelectorAll("[data-qr-close]");
    const duration = reduceMotion ? 0 : 0.38;
    const canAnimate = typeof gsap !== "undefined";
    let isOpen = false;
    let lastTrigger = null;

    if (canAnimate) {
        gsap.set(backdrop, { opacity: 0 });
        gsap.set(panel, { opacity: 0, scale: 0.96 });
    }

    const stopLenis = () => {
        if (lenis && typeof lenis.stop === "function") {
            lenis.stop();
        }
    };

    const startLenis = () => {
        if (lenis && typeof lenis.start === "function") {
            lenis.start();
        }
    };

    const openModal = (openButton) => {
        if (isOpen) {
            return;
        }

        const qrSrc = openButton.getAttribute("data-qr-image");

        if (qrSrc && codeImage) {
            codeImage.src = qrSrc;
        }

        lastTrigger = openButton;
        isOpen = true;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        openButton.setAttribute("aria-expanded", "true");
        stopLenis();

        if (canAnimate) {
            gsap.to(backdrop, {
                opacity: 1,
                duration,
                ease: "power2.out",
            });
            gsap.to(panel, {
                opacity: 1,
                scale: 1,
                duration,
                ease: "power2.out",
            });
        }

        const closeButton = modal.querySelector(".qr-modal__close");

        if (closeButton) {
            closeButton.focus();
        }
    };

    const closeModal = () => {
        if (!isOpen) {
            return;
        }

        const trigger = lastTrigger;

        const finish = () => {
            isOpen = false;
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");

            if (trigger) {
                trigger.setAttribute("aria-expanded", "false");
                trigger.focus();
            }

            startLenis();
        };

        if (canAnimate && duration > 0) {
            gsap.to(backdrop, {
                opacity: 0,
                duration,
                ease: "power2.inOut",
            });
            gsap.to(panel, {
                opacity: 0,
                scale: 0.96,
                duration,
                ease: "power2.inOut",
                onComplete: finish,
            });
            return;
        }

        finish();
    };

    openButtons.forEach((openButton) => {
        openButton.addEventListener("click", () => {
            openModal(openButton);
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen) {
            closeModal();
        }
    });
}

function initDesignGallerySlider(reduceMotion) {
    const root = document.querySelector(".design-gallery__slider");
    const track = root ? root.querySelector(".design-gallery__track") : null;
    const group = track ? track.querySelector(".design-gallery__group") : null;

    if (!root || !track || !group || typeof gsap === "undefined") {
        return null;
    }

    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("button").forEach((button) => {
        button.setAttribute("tabindex", "-1");
    });
    track.appendChild(clone);

    let tween = null;
    let started = false;
    let resizeTimer = 0;

    const startLoop = () => {
        const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap) || 0;
        const distance = group.offsetWidth + gap;

        if (tween) {
            tween.kill();
            tween = null;
        }

        if (distance <= gap) {
            return;
        }

        gsap.set(track, { x: 0 });

        if (reduceMotion) {
            return;
        }

        tween = gsap.to(track, {
            x: -distance,
            duration: 30,
            ease: "none",
            repeat: -1,
            force3D: true,
        });
    };

    const images = root.querySelectorAll("img");
    let pending = images.length;

    const maybeStart = () => {
        pending -= 1;

        if (started || pending > 0) {
            return;
        }

        started = true;
        startLoop();
    };

    if (!images.length) {
        started = true;
        startLoop();
    } else {
        images.forEach((image) => {
            if (image.complete) {
                maybeStart();
                return;
            }

            image.addEventListener("load", maybeStart, { once: true });
            image.addEventListener("error", maybeStart, { once: true });
        });
    }

    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(startLoop, 180);
    });

    return {
        autoplay: {
            stop: () => {
                if (tween) {
                    tween.pause();
                }
            },
            start: () => {
                if (tween) {
                    tween.play();
                }
            },
        },
    };
}

function initDesignGalleryModal(lenis, reduceMotion, slider) {
    const modal = document.querySelector("#design-gallery-modal");
    const gallery = document.querySelector(".design-gallery");

    if (!modal || !gallery) {
        return;
    }

    const overlay = modal.querySelector(".design-gallery-modal__overlay");
    const dialog = modal.querySelector(".design-gallery-modal__dialog");
    const image = modal.querySelector(".design-gallery-modal__image");
    const closeButton = modal.querySelector(".design-gallery-modal__close");
    const duration = reduceMotion ? 0 : 0.42;
    const canAnimate = typeof gsap !== "undefined";
    let isOpen = false;
    let lastTrigger = null;
    let dragDistance = 0;
    let dragStartX = 0;

    if (canAnimate) {
        gsap.set(overlay, { opacity: 0 });
        gsap.set(dialog, { opacity: 0, scale: 0.96 });
    }

    const pauseSlider = () => {
        if (slider && slider.autoplay && typeof slider.autoplay.stop === "function") {
            slider.autoplay.stop();
        }
    };

    const resumeSlider = () => {
        if (slider && slider.autoplay && typeof slider.autoplay.start === "function") {
            slider.autoplay.start();
        }
    };

    const stopLenis = () => {
        if (lenis && typeof lenis.stop === "function") {
            lenis.stop();
        }
    };

    const startLenis = () => {
        if (lenis && typeof lenis.start === "function") {
            lenis.start();
        }
    };

    const openModal = (trigger) => {
        if (isOpen) {
            return;
        }

        const src = trigger.getAttribute("data-modal-image");
        const alt = trigger.getAttribute("data-modal-alt") || "";
        const group = trigger.getAttribute("data-modal-group");

        if (!src) {
            return;
        }

        lastTrigger = trigger;
        image.src = src;
        image.alt = alt;
        image.classList.toggle("is-poster", group === "poster");
        image.classList.toggle("is-pack", group === "pack");
        dialog.classList.toggle("is-pack", group === "pack");

        isOpen = true;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        pauseSlider();
        stopLenis();

        if (canAnimate) {
            gsap.to(overlay, {
                opacity: 1,
                duration,
                ease: "power2.out",
            });
            gsap.to(dialog, {
                opacity: 1,
                scale: 1,
                duration,
                ease: "power2.out",
            });
        }

        if (closeButton) {
            closeButton.focus();
        }
    };

    const closeModal = () => {
        if (!isOpen) {
            return;
        }

        const finish = () => {
            isOpen = false;
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            image.removeAttribute("src");
            image.alt = "";
            resumeSlider();
            startLenis();

            if (lastTrigger && lastTrigger.getAttribute("tabindex") !== "-1") {
                lastTrigger.focus();
            }
        };

        if (canAnimate && duration > 0) {
            gsap.to(overlay, {
                opacity: 0,
                duration,
                ease: "power2.inOut",
            });
            gsap.to(dialog, {
                opacity: 0,
                scale: 0.98,
                duration,
                ease: "power2.inOut",
                onComplete: finish,
            });
            return;
        }

        finish();
    };

    gallery.addEventListener("pointerdown", (event) => {
        const item = event.target.closest(".design-gallery__item");

        if (!item) {
            return;
        }

        dragDistance = 0;
        dragStartX = event.clientX;
    });

    gallery.addEventListener("pointermove", (event) => {
        dragDistance = Math.abs(event.clientX - dragStartX);
    });

    gallery.addEventListener("click", (event) => {
        const item = event.target.closest(".design-gallery__item");

        if (!item) {
            return;
        }

        event.preventDefault();

        if (dragDistance > 8) {
            return;
        }

        openModal(item);
    });

    if (overlay) {
        overlay.addEventListener("click", closeModal);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    if (dialog) {
        dialog.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen) {
            closeModal();
        }
    });
}

function initContactEndingAnimation(reduceMotion) {
    const section = document.querySelector("#contact.contact-ending");

    if (!section || typeof gsap === "undefined") {
        return;
    }

    const lineLets = section.querySelector(".contact-poster__line--lets");
    const lineWork = section.querySelector(".contact-poster__line--work");
    const lineTogether = section.querySelector(".contact-poster__line--together");
    const emailMask = section.querySelector(".contact-poster__email-mask");
    const mailButton = section.querySelector(".contact-ending__mail");
    const thanks = section.querySelector(".contact-ending__thanks");

    if (!lineLets || !lineWork || !lineTogether || !emailMask || !mailButton || !thanks) {
        return;
    }

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const clip = {
        letsHidden: "inset(0% 100% 56% 0%)",
        letsShown: "inset(0% 0% 56% 0%)",
        workHidden: "inset(26% 100% 26% 0%)",
        workShown: "inset(26% 0% 26% 0%)",
        togetherHidden: "inset(54% 100% 0% 0%)",
        togetherShown: "inset(54% 0% 0% 0%)",
        emailHidden: "inset(0% 100% 0% 0%)",
        emailShown: "inset(0% 0% 0% 0%)",
        fullShown: "inset(0% 0% 0% 0%)",
    };

    const clipProps = (value) => ({
        clipPath: value,
        webkitClipPath: value,
        force3D: false,
    });

    if (reduceMotion) {
        gsap.set([lineLets, lineWork, lineTogether], clipProps(clip.fullShown));
        gsap.set(emailMask, clipProps(clip.emailShown));
        gsap.set([mailButton, thanks], { opacity: 1, y: 0, xPercent: -50 });
        return;
    }

    gsap.set(lineLets, clipProps(clip.letsHidden));
    gsap.set(lineWork, clipProps(clip.workHidden));
    gsap.set(lineTogether, clipProps(clip.togetherHidden));
    gsap.set(emailMask, clipProps(clip.emailHidden));
    gsap.set([mailButton, thanks], { opacity: 0, xPercent: -50 });
    gsap.set(mailButton, { y: 30 });
    gsap.set(thanks, { y: 40 });

    let fadePlayed = false;

    const playFade = () => {
        if (fadePlayed) {
            return;
        }

        fadePlayed = true;

        gsap.to(mailButton, {
            opacity: 1,
            y: 0,
            xPercent: -50,
            duration: 0.9,
            ease: "power3.out",
        });

        gsap.to(thanks, {
            opacity: 1,
            y: 0,
            xPercent: -50,
            duration: 1.1,
            delay: 0.12,
            ease: "power3.out",
        });
    };

    const createHandwriting = (start, end, scrub) => {
        const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
                trigger: "#contact",
                start,
                end,
                scrub,
                pin: false,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    if (self.progress >= 0.96) {
                        playFade();
                    }
                },
                onLeave: playFade,
            },
        });

        timeline.fromTo(lineLets, clipProps(clip.letsHidden), { ...clipProps(clip.letsShown), duration: 0.7 }, 0);
        timeline.fromTo(lineWork, clipProps(clip.workHidden), { ...clipProps(clip.workShown), duration: 0.7 }, 0.55);
        timeline.fromTo(
            lineTogether,
            clipProps(clip.togetherHidden),
            { ...clipProps(clip.togetherShown), duration: 0.9 },
            1.1
        );
        timeline.fromTo(emailMask, clipProps(clip.emailHidden), { ...clipProps(clip.emailShown), duration: 0.8 }, 1.75);

        return () => {
            if (timeline.scrollTrigger) {
                timeline.scrollTrigger.kill();
            }

            timeline.kill();
            gsap.set(lineLets, clipProps(clip.letsHidden));
            gsap.set(lineWork, clipProps(clip.workHidden));
            gsap.set(lineTogether, clipProps(clip.togetherHidden));
            gsap.set(emailMask, clipProps(clip.emailHidden));
        };
    };

    if (typeof gsap.matchMedia === "function") {
        const media = gsap.matchMedia();

        media.add("(min-width: 403px)", () => createHandwriting("top 75%", "center 35%", 1));
        media.add("(max-width: 402px)", () => createHandwriting("top 82%", "bottom 28%", 0.8));
        return;
    }

    createHandwriting("top 75%", "center 35%", 1);
}

function initProjectShowcaseAnimations(reduceMotion) {
    const sections = document.querySelectorAll(".project-showcase");

    if (!sections.length || typeof gsap === "undefined") {
        return;
    }

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const isMobile = window.matchMedia("(max-width: 402px)").matches;
    const infoY = isMobile ? 24 : 40;
    const deviceY = isMobile ? 26 : 50;

    sections.forEach((section) => {
        const info = section.querySelector(".project-showcase__info");
        const devices = section.querySelectorAll(".project-showcase__device");
        const background = section.querySelector(".project-showcase__background");

        if (!info || !devices.length) {
            return;
        }

        if (reduceMotion) {
            gsap.set([info, devices], { opacity: 1, y: 0 });
            gsap.set(background, { scale: 1 });
            return;
        }

        gsap.set(info, { opacity: 0, y: infoY });
        gsap.set(devices, { opacity: 0, y: deviceY });
        gsap.set(background, { scale: 1.02, transformOrigin: "center center" });

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                once: true,
            },
        });

        timeline.to(
            background,
            {
                scale: 1,
                duration: 1.15,
                ease: "power2.out",
            },
            0
        );

        timeline.to(
            info,
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
            },
            0.08
        );

        timeline.to(
            devices,
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.1,
            },
            0.2
        );
    });
}

function initSideProjectHorizontalScroll(reduceMotion) {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    const section = document.querySelector("#side-project.side-project-horizontal");
    const track = section && section.querySelector(".side-project-horizontal__track");
    const panels = section ? gsap.utils.toArray(".side-project-panel", section) : [];

    if (!section || !track || panels.length < 2) {
        return;
    }

    section.querySelectorAll(".side-project-panel__button[href='#']").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
        });
    });

    gsap.registerPlugin(ScrollTrigger);

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const refreshOnceImagesLoad = () => {
        const images = Array.from(section.querySelectorAll("img"));
        const pending = images.filter((image) => !image.complete);

        if (!pending.length) {
            ScrollTrigger.refresh();
            return;
        }

        let remaining = pending.length;
        pending.forEach((image) => {
            image.addEventListener(
                "load",
                () => {
                    remaining -= 1;
                    if (remaining === 0) {
                        ScrollTrigger.refresh();
                    }
                },
                { once: true }
            );
            image.addEventListener(
                "error",
                () => {
                    remaining -= 1;
                    if (remaining === 0) {
                        ScrollTrigger.refresh();
                    }
                },
                { once: true }
            );
        });
    };

    const media = gsap.matchMedia();

    media.add("(min-width: 403px)", () => {
        const tween = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                pin: true,
                scrub: reduceMotion ? 0 : 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                end: () => "+=" + getDistance(),
            },
        });

        refreshOnceImagesLoad();

        return () => {
            if (tween.scrollTrigger) {
                tween.scrollTrigger.kill();
            }
            tween.kill();
            gsap.set(track, { clearProps: "transform,x" });
            panels.forEach((panel) => {
                gsap.set(panel, { clearProps: "transform,x" });
            });
        };
    });
}
