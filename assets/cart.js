class CartRemoveButton extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('click', (event) => {
            event.preventDefault();
            const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
            const cartProductId = this.dataset.productId;
            const cartVariantId = this.dataset.variantId;
            // const timerElec = this.closest('cart-drawer-items').querySelector('timer-cart');
            // timerElec.startTimer(0, new timerDrawer() , cartVariantId)
            cartItems.updateQuantity(this.dataset.index, 0, '', cartProductId, cartVariantId);
        });
    }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
    constructor() {
        super();
        this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

        const debouncedOnChange = debounce((event) => {
            this.onChange(event);
        }, ON_CHANGE_DEBOUNCE_TIMER);

        this.addEventListener('change', debouncedOnChange.bind(this));
    }

    cartUpdateUnsubscriber = undefined;

    connectedCallback() {
        this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
            if (event.source === 'cart-items') {
                return;
            }
            this.onCartUpdate();
        });
    }

    disconnectedCallback() {
        if (this.cartUpdateUnsubscriber) {
            this.cartUpdateUnsubscriber();
        }
    }

    onChange(event) {
        let qtyValue = event.target.value;
        console.log('qtyValue===', qtyValue);
        this.updateQuantity(event.target.dataset.index, qtyValue, document.activeElement.getAttribute('name'));
    }

    onCartUpdate() {
        fetch('/cart?section_id=main-cart-items')
            .then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html');
                const sourceQty = html.querySelector('cart-items');
                this.innerHTML = sourceQty.innerHTML;
            })
            .catch(e => {
                console.error(e);
            });
    }

    getSectionsToRender() {
        return [{
                id: 'main-cart-items',
                section: document.getElementById('main-cart-items').dataset.id,
                selector: '.js-contents'
            },
            {
                id: 'cart-icon-bubble',
                section: 'cart-icon-bubble',
                selector: '.shopify-section'
            },
            {
                id: 'cart-live-region-text',
                section: 'cart-live-region-text',
                selector: '.shopify-section'
            },
            {
                id: 'main-cart-footer',
                section: document.getElementById('main-cart-footer').dataset.id,
                selector: '.js-contents'
            }
        ];
    }

    updateQuantity(line, quantity, name, id, vid) {
        this.enableLoading(line);

        const body = JSON.stringify({
            line,
            quantity,
            sections: this.getSectionsToRender().map((section) => section.section),
            sections_url: window.location.pathname
        });

        fetch(`${routes.cart_change_url}`, {...fetchConfig(), ... { body } })
            .then((response) => {
                return response.text();
            })
            .then((state) => {
                const parsedState = JSON.parse(state);
                const quantityElement = document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
                const items = document.querySelectorAll('.cart-item');


                if (parsedState.errors) {
                    quantityElement.value = quantityElement.getAttribute('value');
                    this.updateLiveRegions(line, parsedState.errors);
                    return;
                }

                this.classList.toggle('is-empty', parsedState.item_count === 0);
                const cartDrawerWrapper = document.querySelector('cart-drawer');
                const cartFooter = document.getElementById('main-cart-footer');

                if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
                if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

                this.getSectionsToRender().forEach((section => {
                    const elementToReplace =
                        document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
                    elementToReplace.innerHTML =
                        this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
                }));
                const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;

                let message = '';
                if (items.length === parsedState.items.length && updatedValue !== parseInt(quantityElement.value)) {
                    if (typeof updatedValue === 'undefined') {
                        message = window.cartStrings.error;
                    } else {
                        message = window.cartStrings.quantityError.replace('[quantity]', updatedValue);
                    }
                }
                this.updateLiveRegions(line, message);

                const lineItem = document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
                if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
                    cartDrawerWrapper ? trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`)) : lineItem.querySelector(`[name="${name}"]`).focus();
                } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
                    trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'))
                } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
                    trapFocus(cartDrawerWrapper, document.querySelector('.cart-item__name'))
                }
                publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items' });


                $('#item__timer--' + vid).countdown('stop');


                var timerObj = localStorage.getItem('timers');
                var timerJSON = JSON.parse(timerObj);
                if (timerJSON.length > 0) {
                    var indexJSON = timerJSON.findIndex((x) => x.id == vid)
                    if (indexJSON > -1) { // only splice array when item is found
                        timerJSON.splice(indexJSON, 1); // 2nd parameter means remove one item only
                        timerJSON = timerJSON.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
                        localStorage.setItem(`timers`, JSON.stringify(timerJSON));
                    }
                }

                rmCookie(vid, id);

            }).catch(() => {
                this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
                // const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
                // errors.textContent = window.cartStrings.error;
            })
            .finally(() => {
                this.disableLoading(line);
                var cartCount = document.querySelector('cart-drawer-items').dataset.count;
                if (cartCount == '0') {
                    $('#desktopBagCount').hide();
                    $('.desktop-icon-count').hide();
                    $('.countdown').hide();
                    $('.mobiletimer,.timerAllPage').hide();
                    // setCookie('0_minute', '00');
                    // setCookie('0_second', '00');
                    $('.numberIcon').html(0);
                    localStorage.setItem(`timers`, '[]');

                } else {
                    $('.countdown').show();
                    $('#desktopBagCount').show();
                    $('.desktop-icon-count').show();
                    $('.numberIcon').html(cartCount);

                    setTimeout(function() {
                        var storedTimers = localStorage.getItem('timers');
                        var timersJSONStores = JSON.parse(storedTimers);
                        if (timersJSONStores.length > 0) {
                            timersJSONStores.forEach(function(timer) {
                                createTimer(timer.id, timer.duration);
                            });
                        }
                    })

                }

            });
    }

    updateLiveRegions(line, message) {
        const lineItemError = document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
        if (lineItemError) lineItemError.querySelector('.cart-item__error-text').innerHTML = message;

        this.lineItemStatusElement.setAttribute('aria-hidden', true);

        const cartStatus = document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
        cartStatus.setAttribute('aria-hidden', false);

        setTimeout(() => {
            cartStatus.setAttribute('aria-hidden', true);
        }, 1000);
    }

    getSectionInnerHTML(html, selector) {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector).innerHTML;
    }

    enableLoading(line) {
        const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
        mainCartItems.classList.add('cart__items--disabled');

        const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading-overlay`);
        const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading-overlay`);

        [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

        document.activeElement.blur();
        this.lineItemStatusElement.setAttribute('aria-hidden', false);
    }

    disableLoading(line) {
        const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
        mainCartItems.classList.remove('cart__items--disabled');

        const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading-overlay`);
        const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading-overlay`);

        cartItemElements.forEach((overlay) => overlay.classList.add('hidden'));
        cartDrawerItemElements.forEach((overlay) => overlay.classList.add('hidden'));
    }
}

customElements.define('cart-items', CartItems);

if (!customElements.get('cart-note')) {
    customElements.define('cart-note', class CartNote extends HTMLElement {
        constructor() {
            super();

            this.addEventListener('change', debounce((event) => {
                const body = JSON.stringify({ note: event.target.value });
                fetch(`${routes.cart_update_url}`, {...fetchConfig(), ... { body } });
            }, ON_CHANGE_DEBOUNCE_TIMER))
        }
    });
};

function setCookie1(cname, cvalue, exdays = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (10 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function rmCookie(id, productid) {

    if ($('#item__timer--' + id).length == 0) {
        $('.timerAllPage').hide();
        $('.timerAllPage').countdown('stop');
    }

    $.ajax({
        url: 'https://oyr2io95dd.execute-api.us-east-2.amazonaws.com/PROD/delete_stock',
        method: 'post',
        data: '{"key1": "' + productid + '", "key2": "1" ,"key3": "0"}',
        crossDomain: true,
        contentType: "text/plain",
        success: function(data) {

            if (data.statusCode == 200) {
                if (window.productObject != undefined) {
                    window.productObject.product_id = window.productObject.id
                    if (productid == window.productObject.product_id) {
                        $(`[data-product-id="product-template-${window.productObject.product_id}"] #buy_now1`).hide();
                        $(`[data-product-id="product-template-${window.productObject.product_id}"] #buy_now2`).show();
                        $(`[data-product-id="product-template-${window.productObject.product_id}"] .cartButtonOut3`).hide();
                        $(`[data-product-id="product-template-${window.productObject.product_id}"] .hideme`).show();
                        $(`[data-product-id="product-template-${window.productObject.product_id}"] .cartButtonOut2`).hide();
                        $(`[data-product-id="product-template-${window.productObject.product_id}"] .cartButtonOut1`).hide();
                    }
                }



            }
        },
        error: function(xhr, status, error) {
            console.log('fail');
            console.log(error);
        }
    });
    // event.preventDefault();

}

var timers = [];

var storedTimers = localStorage.getItem('timers');
var timersJSON = JSON.parse(storedTimers);
if (storedTimers) {
    timersJSON = timersJSON.sort((a, b) => parseInt(b.duration) - parseInt(a.duration))
    timersJSON.forEach(function(timer) {
        createTimer(timer.id, timer.duration);
    });
}

document.addEventListener('ajaxProduct:added', function(evt) {
    var variantID = evt.detail.product.id;
    window.productObject = evt.detail.product;
    setTimeout(function() {
        createTimer(variantID, '480:00');
    }, 200)

});

function createTimer(timerId, duration) {

    var indexJSON = timers.findIndex((x) => x.id == timerId)
    if (indexJSON > -1) { // only splice array when item is found
        timers.splice(indexJSON, 1);
    }

    timers.push({ id: timerId, duration: duration });
    timers = timers.sort((a, b) => parseInt(b.duration) - parseInt(a.duration))
    localStorage.setItem('timers', JSON.stringify(timers));

    var getItem = localStorage.getItem('timers');
    var timersJSON = JSON.parse(getItem);
    timersJSON = timersJSON.sort((a, b) => parseInt(b.duration) - parseInt(a.duration))
    timersJSON.forEach(function(timer) {
        if ($('#item__timer--' + timer.id).length > 0) {
            $('.cart_product-timer').each(function() {
                $('.item__timer--' + timer.id).countdown(new Date().getTime() + parseInt(timer.duration) * 1000)
                    .on('update.countdown', function(event) {
                        timer.duration = `${event.offset.totalSeconds}:00`
                        $(this).text(event.strftime('%M:%S'));

                        var indexJSON = timers.findIndex((x) => x.id == timer.id);
                        if (indexJSON > -1) { // only splice array when item is found
                            timers.splice(indexJSON, 1);
                        }
                        timers.push({ id: timer.id, duration: timer.duration });
                        timers = timers.sort((a, b) => parseInt(b.duration) - parseInt(a.duration))
                        localStorage.setItem('timers', JSON.stringify(timers));
                    })
                    .on('finish.countdown', function(event) {
                        // $(this).text('Time\'s up!');
                        var indexJSON = timers.findIndex((x) => x.id == timer.id);
                        if (indexJSON > -1) { // only splice array when item is found
                            timers.splice(indexJSON, 1);
                        }
                        localStorage.setItem('timers', JSON.stringify(timers));
                        // $(this).closest('.cart-item__media').find('cart-remove-button').click();

                        const cartItems = $(this).closest('cart-items')[0] || $(this).closest('cart-drawer-items')[0];
                        const cartProductId = $(this).closest('.cart-item__media').find('cart-remove-button').attr('data-product-id');
                        const cartVariantId = $(this).closest('.cart-item__media').find('cart-remove-button').attr('data-variant-id');
                        const itemInder = $(this).closest('.cart-item__media').find('cart-remove-button').attr('data-index');
                        cartItems.updateQuantity(itemInder, 0, '', cartProductId, cartVariantId);

                    });

            })
            $('.timerAllPage').show();
            $('.timerAllPage').countdown(new Date().getTime() + parseInt(timer.duration) * 1000)
                .on('update.countdown', function(event) {
                    $(this).text(event.strftime('%M:%S'));
                })

        }
    });
}