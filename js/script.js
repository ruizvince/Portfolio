document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const hamburger = document.querySelector(".hamburger");
    const navLinksContainer = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-link");
    const themeToggle = document.getElementById("theme-toggle");
    const sections = document.querySelectorAll(".section");
    const skillsSection = document.getElementById("skills");
    const skillBars = document.querySelectorAll(".progress-line span");
    const topButton = document.getElementById("scrollToTop");
    const contactForm = document.querySelector(".contact-form");

    const hideLoader = () => {
        if (!loader) return;
        loader.style.opacity = "0";
        setTimeout(() => { loader.style.display = "none"; }, 500);
    };

    window.addEventListener("load", hideLoader);
    if (document.readyState === "complete") hideLoader();

    const toggleMenu = () => {
        hamburger.classList.toggle("active");
        navLinksContainer.classList.toggle("active");
    };

    hamburger.addEventListener("click", toggleMenu);
    navLinks.forEach(link => link.addEventListener("click", (event) => {
        if (hamburger.classList.contains("active")) toggleMenu();
        layoutIndicator(event.currentTarget);
    }));

    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const targetTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", targetTheme);
        localStorage.setItem("theme", targetTheme);
    });

    const animateSkills = () => {
        skillBars.forEach(bar => {
            const parent = bar.parentElement;
            const percentage = parent.getAttribute("data-percent");
            bar.style.width = percentage;
        });
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    if (skillsSection) skillsObserver.observe(skillsSection);

    const navIndicator = document.createElement("div");
    navIndicator.classList.add("nav-indicator");
    navLinksContainer.appendChild(navIndicator);

    const layoutIndicator = (activeLink) => {
        if (!activeLink || window.innerWidth <= 768) return;
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = navLinksContainer.getBoundingClientRect();
        navIndicator.style.width = `${linkRect.width}px`;
        navIndicator.style.left = `${linkRect.left - containerRect.left}px`;
    };

    const currentActiveLink = document.querySelector('.nav-link.active');
    layoutIndicator(currentActiveLink);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal");
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(sec => sectionObserver.observe(sec));

    const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
    const navActiveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("id");
            navLinks.forEach(link => {
                const isActive = link.getAttribute("href") === `#${id}`;
                link.classList.toggle("active", isActive);
                if (isActive) layoutIndicator(link);
            });
        });
    }, { rootMargin: `-${navHeight * 0.4}px 0px -${navHeight * 0.6}px 0px`, threshold: 0.2 });

    sections.forEach(sec => navActiveObserver.observe(sec));

    window.addEventListener("resize", () => {
        const currentActive = document.querySelector('.nav-link.active');
        layoutIndicator(currentActive);
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            topButton.classList.add("show");
        } else {
            topButton.classList.remove("show");
        }
    });

    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    if (contactForm) {
        contactForm.addEventListener("submit", () => {
            const submitButton = contactForm.querySelector('[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }
        });
    }
});