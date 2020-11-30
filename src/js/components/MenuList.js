export default class MenuList {
    constructor(props, handler) {
        this.items = props;
        this.eventHandler = handler;
    }

    active(category) {
        const categories = document.querySelectorAll('.menu-item');
        for (const li of categories) {
            li.classList.remove('active');
            if (li.getAttribute('id') === category) {
                li.classList.add('active');
            }
        }
    }

    onPage(category) {
        const rightSideWrapper = document.querySelector('#rightside-wrapper');
        rightSideWrapper.innerHTML = '';
        this.eventHandler.emit('renderProductsByCategory', category);
        this.active(category);
    }

    render() {
        const ul = document.querySelector('.menu-list');
        for (const item of this.items) {
            const li = document.createElement('li');
            li.setAttribute('id', item.category);
            li.className = 'menu-item';
            li.innerHTML = item.name;

            li.addEventListener('click', () => this.onPage(item.category));

            ul.append(li);
        }
    }
}
