document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.site-header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Hamburger menu toggle
    function setMenu(open) {
        hamburger.classList.toggle('active', open);
        navLinks.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            setMenu(!navLinks.classList.contains('open'));
        });
        // Close menu when a link is clicked, on Escape or on outside click
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() { setMenu(false); });
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') setMenu(false);
        });
        document.addEventListener('click', function(e) {
            if (header && !header.contains(e.target)) setMenu(false);
        });
    }

    // Header background after scrolling
    if (header) {
        const onScroll = function() {
            header.classList.toggle('scrolled', window.scrollY > 40);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Reveal elements when they enter the viewport
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function(el) { observer.observe(el); });
    } else {
        revealEls.forEach(function(el) { el.classList.add('is-visible'); });
    }

    // Live status: day / night session by Bulgarian time
    function sofiaMinutes() {
        try {
            const parts = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Europe/Sofia',
                hour: '2-digit',
                minute: '2-digit',
                hourCycle: 'h23'
            }).formatToParts(new Date());
            const get = function(type) {
                return Number(parts.find(function(p) { return p.type === type; }).value);
            };
            return (get('hour') % 24) * 60 + get('minute');
        } catch (e) {
            const now = new Date();
            return now.getHours() * 60 + now.getMinutes();
        }
    }

    // \u00a0 keeps "ч." on the same line as the time
    function currentSession(min) {
        if (min >= 7 * 60 && min < 18 * 60 + 30) {
            return { id: 'day', text: 'Сега: дневен риболов · до 18:30\u00a0ч.' };
        }
        if (min >= 19 * 60 || min < 6 * 60 + 30) {
            return { id: 'night', text: 'Сега: нощен риболов · до 06:30\u00a0ч.' };
        }
        if (min >= 18 * 60 + 30) {
            return { id: 'break', text: 'Нощният риболов започва в 19:00\u00a0ч.' };
        }
        return { id: 'break', text: 'Дневният риболов започва в 07:00\u00a0ч.' };
    }

    function updateStatus() {
        const session = currentSession(sofiaMinutes());
        document.querySelectorAll('[data-live-status]').forEach(function(el) {
            el.dataset.state = session.id;
            const text = el.querySelector('[data-live-text]');
            if (text && text.textContent !== session.text) text.textContent = session.text;
        });
        document.querySelectorAll('[data-session]').forEach(function(el) {
            el.classList.toggle('is-now', el.dataset.session === session.id);
        });
    }

    if (document.querySelector('[data-live-status], [data-session]')) {
        updateStatus();
        setInterval(updateStatus, 60000);
    }

    // Copy GPS coordinates
    document.querySelectorAll('[data-copy]').forEach(function(btn) {
        const label = btn.querySelector('[data-copy-label]');
        const original = label ? label.textContent : '';

        btn.addEventListener('click', async function() {
            const value = btn.dataset.copy;
            try {
                await navigator.clipboard.writeText(value);
            } catch (e) {
                const ta = document.createElement('textarea');
                ta.value = value;
                ta.setAttribute('readonly', '');
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); } catch (err) { /* ignore */ }
                ta.remove();
            }
            btn.classList.add('copied');
            if (label) label.textContent = 'Копирано!';
            setTimeout(function() {
                btn.classList.remove('copied');
                if (label) label.textContent = original;
            }, 2000);
        });
    });

    // Open the Tawk.to live chat
    document.querySelectorAll('[data-open-chat]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const api = window.Tawk_API;
            if (api && typeof api.maximize === 'function') {
                api.maximize();
            } else {
                window.location.href = 'mailto:komitoviqgyol@gmail.com';
            }
        });
    });

    // Current year in the footer
    document.querySelectorAll('[data-year]').forEach(function(el) {
        el.textContent = new Date().getFullYear();
    });
});
