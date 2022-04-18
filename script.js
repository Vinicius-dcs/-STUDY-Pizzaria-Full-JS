let modalQt = 1;
let cart = [];
let modalKey = 0;

// Anonymous functions (funções sem nome) are functions unnamed.
const selector = (element) => document.querySelector(element);
const selectorAll = (element) => document.querySelectorAll(element);

// Arrow function
pizzaJson.map((item, index) => {
    let pizzaItem = selector('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    pizzaItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        // Get key of pizza
        let key = event.target.closest('.pizza-item').getAttribute('data-key');
        let modalQt = 1;
        modalKey = key;


        // Fill modal
        selector('.pizzaWindowBody img').src = pizzaJson[key].img;
        selector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        selector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        selector('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[key].price.toFixed(2)}`;
        selector('.pizzaInfo--size.selected').classList.remove('selected');
        selectorAll('.pizzaInfo--size').forEach((item, index) => {
            index == 2 ? item.classList.add('selected') : '';
            item.querySelector('span').innerHTML = pizzaJson[key].sizes[index];
        });

        selector('.pizzaInfo--qt').innerHTML = modalQt;

        // Show modal and opacity effect 
        selector('.pizzaWindowArea').style.opacity = 0;
        selector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            selector('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    })

    selector('.pizza-area').append(pizzaItem);
})

// Events of modal
const closeModal = () => {
    selector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        selector('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

selectorAll('.pizzaInfo--cancelButton, .pizzaInfo--calceMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

selector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        selector('.pizzaInfo--qt').innerHTML = modalQt;
    } else {

    }
});

selector('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    selector('.pizzaInfo--qt').innerHTML = modalQt;
});

selectorAll('.pizzaInfo--size').forEach((item, index) => {
    item.addEventListener('click', (element) => {
        selector('.pizzaInfo--size.selected').classList.remove('selected');
        item.classList.add('selected');
    })
});

selector('.pizzaInfo--addButton').addEventListener('click', () => {
    let sizePizza = selector('.pizzaInfo--size.selected').getAttribute('data-key');
    let identifier = pizzaJson[modalKey].id + '@' + sizePizza;
    let keyWanted = cart.findIndex((item) => item.identifier == identifier);


    if (keyWanted > -1) {
        cart[keyWanted].size += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size: parseInt(sizePizza),
            qt: modalQt
        })
    }

    updateCart();
    closeModal();
});

selector('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        selector('aside').style.left = '0';
    }
});

selector('.menu-closer').addEventListener('click', () => {
    selector('aside').style.left = '100vw';
});

const updateCart = () => {
    selector('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        selector('aside').classList.add('show');
        selector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i = 0; i < cart.length; i++) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = selector('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            subtotal += pizzaItem.price * cart[i].qt;

            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            selector('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        selector('.subtotal span:last-child').innerHTML = `R$${subtotal.toFixed(2)}`;
        selector('.desconto span:last-child').innerHTML = `R$${desconto.toFixed(2)}`;
        selector('.total span:last-child').innerHTML = `R$${total.toFixed(2)}`;

    } else {
        selector('aside').classList.remove('show');
        selector('aside').style.left = '100vw';
    }
}