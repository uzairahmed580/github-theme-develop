class CartDrawer extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
         if(this.querySelector('#CartDrawer-Overlay') != null) {
          this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
         }
        this.setHeaderCartIconAccessibility();
    }

    setHeaderCartIconAccessibility() {
        const cartLink = document.querySelector('#cart-icon-bubble');
        const cartLinkD = document.querySelector('#cart-icon-bubble-desktop');
        cartLink.setAttribute('role', 'button');
        cartLink.setAttribute('aria-haspopup', 'dialog');
        cartLink.addEventListener('click', (event) => {
            event.preventDefault();
            this.open(cartLink)
        });
        cartLink.addEventListener('keydown', (event) => {
            if (event.code.toUpperCase() === 'SPACE') {
                event.preventDefault();
                this.open(cartLink);
            }
        });

        cartLinkD.setAttribute('role', 'button');
        cartLinkD.setAttribute('aria-haspopup', 'dialog');
        cartLinkD.addEventListener('click', (event) => {
            event.preventDefault();
            this.open(cartLinkD)
        });
        cartLinkD.addEventListener('keydown', (event) => {
            if (event.code.toUpperCase() === 'SPACE') {
                event.preventDefault();
                this.open(cartLinkD);
            }
        });
    }

    open(triggeredBy) {
        if (triggeredBy) this.setActiveElement(triggeredBy);
        const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
        if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
        // here the animation doesn't seem to always get triggered. A timeout seem to help
        setTimeout(() => { this.classList.add('animate', 'active') });

        this.addEventListener('transitionend', () => {
            const containerToTrapFocusOn = this.classList.contains('is-empty') ? this.querySelector('.drawer__inner-empty') : document.getElementById('CartDrawer');
            const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
            trapFocus(containerToTrapFocusOn, focusElement);
        }, { once: true });

        document.body.classList.add('overflow-hidden');
    }

    close() {
        this.classList.remove('active');
        removeTrapFocus(this.activeElement);
        document.body.classList.remove('overflow-hidden');
    }

    setSummaryAccessibility(cartDrawerNote) {
        cartDrawerNote.setAttribute('role', 'button');
        cartDrawerNote.setAttribute('aria-expanded', 'false');

        if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
            cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
        }

        cartDrawerNote.addEventListener('click', (event) => {
            event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
        });

        cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
    }

    renderContents(parsedState) {
        this.querySelector('.drawer__inner').classList.contains('is-empty') && this.querySelector('.drawer__inner').classList.remove('is-empty');
        this.productId = parsedState.id;

        
        this.getSectionsToRender().forEach((section => {
            const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
            sectionElement.innerHTML =
                this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
        }));

        setTimeout(() => {
            this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
            this.open();
            var cartCount = document.querySelector('cart-drawer-items').dataset.count;
            var checkoutButton = document.getElementById('CartDrawer-Checkout');
            if(checkoutButton != null) {
              if (window.checkoutText == true) {
                checkoutButton.textContent = "Secure Checkout";
              }
            }
            if (cartCount == '0') {
                alert('hello');
                $('#desktopBagCount').hide();
                $('.desktop-icon-count').hide();

                $('.mobiletimer').hide();
                // setCookie('0_minute', '00');
                // setCookie('0_second', '00');
                $('.numberIcon').html(0)
            } else {
                $('.desktop-icon-count').show();
                $('#desktopBagCount').show();
                $('.numberIcon').html(cartCount)
            }
        });
    }

    getSectionInnerHTML(html, selector = '.shopify-section') {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector).innerHTML;
    }

    getSectionsToRender() {
        return [{
            id: 'cart-drawer',
            selector: '#CartDrawer'
        }];
    }

    getSectionDOM(html, selector = '.shopify-section') {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector);
    }

    setActiveElement(element) {
        this.activeElement = element;
    }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
    getSectionsToRender() {
        return [{
            id: 'CartDrawer',
            section: 'cart-drawer',
            selector: '.drawer__inner'
        }];
    }
}

customElements.define('cart-drawer-items', CartDrawerItems);