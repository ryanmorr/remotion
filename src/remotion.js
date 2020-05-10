export default function remotion(element, className) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    if (typeof className === 'function') {
        if (className.length === 2) {
            return new Promise((resolve) => className(element, () => {
                element.remove();
                resolve(element);
            }));
        }
        className = className(element);
    }
    return new Promise((resolve) => {
        const onEnd = () => {
            element.classList.remove(className);
            element.remove();
            resolve(element);
        };
        const options = {once: true};
        element.addEventListener('transitionend', onEnd, options);
        element.addEventListener('transitioncancel', onEnd, options);
        element.addEventListener('animationend', onEnd, options);
        element.addEventListener('animationcancel', onEnd, options);
        element.classList.add(className);
        void element.offsetWidth;
    });
}
