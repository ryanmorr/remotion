export default function removeElement(element, className) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    if (typeof className === 'function') {
        className = className(element);
    }
    return new Promise((resolve) => {
        const onEnd = () => {
            element.classList.remove(className);
            element.removeEventListener('transitionend', onEnd);
            element.remove();
            resolve(element);
        };
        element.addEventListener('transitionend', onEnd);
        element.classList.add(className);
    });
}
