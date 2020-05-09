export default function remotion(element, className) {
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
            element.removeEventListener('transitioncancel', onEnd);
            element.removeEventListener('animationend', onEnd);
            element.removeEventListener('animationcancel', onEnd);
            element.remove();
            resolve(element);
        };
        element.addEventListener('transitionend', onEnd);
        element.addEventListener('transitioncancel', onEnd);
        element.addEventListener('animationend', onEnd);
        element.addEventListener('animationcancel', onEnd);
        element.classList.add(className);
    });
}
