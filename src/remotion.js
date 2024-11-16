function removeElement(element, value) {
    if (typeof value === 'undefined') {
        element.remove();
        return Promise.resolve(element);
    }
    if (typeof value === 'function') {
        value = value(element);
        if (value instanceof Promise) {
            return value.then(() => {
                if (element.parentNode) {
                    element.remove();
                }
                return element;
            });
        }
    }
    return new Promise((resolve) => {
        const onEvent = () => {
            element.classList.remove(value);
            element.removeEventListener('transitionend', onEvent);
            element.removeEventListener('transitioncancel', onEvent);
            element.removeEventListener('animationend', onEvent);
            element.removeEventListener('animationcancel', onEvent);
            element.remove();
            resolve(element);
        };
        element.addEventListener('transitionend', onEvent);
        element.addEventListener('transitioncancel', onEvent);
        element.addEventListener('animationend', onEvent);
        element.addEventListener('animationcancel', onEvent);
        element.classList.add(value);
        void element.offsetWidth;
    });
}

export default function remotion(element, value) {
    if (typeof element === 'string') {
        element = document.querySelectorAll(element);
    }
    if (typeof element.length === 'number') {
        return Promise.all(Array.from(element).map((el) => removeElement(el, value)));
    }
    return removeElement(element, value);
}
