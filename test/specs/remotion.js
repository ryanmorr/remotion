import remotion from '../../src/remotion';

describe('remotion', () => {
    let element;
    const style = document.createElement('style');
    style.innerHTML = `
        .transition-fade {
            opacity: 1;
            transition: opacity 0.5s ease-out;
        }
        
        .transition-fade-out {
            opacity: 0;
        }

        @keyframes animation-fade-out {
            from { opacity: 1}
            to { opacity: 0 }
        }
        
        .animation-fade-out {
            animation: animation-fade-out 0.5s ease-out;
        }
    `;
    document.head.appendChild(style);

    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    it('should remove an element', (done) => {
        const promise = remotion(element);

        expect(promise).to.be.a('promise');
        expect(document.contains(element)).to.equal(false);

        promise.then((el) => {
            expect(el).to.equal(element);
            done();
        });
    });

    it('should transition an element before removing it from the DOM', async () => {
        element.classList.add('transition-fade');

        const promise = remotion(element, 'transition-fade-out');

        expect(promise).to.be.a('promise');
        expect(document.contains(element)).to.equal(true);
        expect(element.classList.contains('transition-fade-out')).to.equal(true);

        element.dispatchEvent(new Event('transitionend'));

        const el = await promise;
        
        expect(el).to.equal(element);
        expect(document.contains(element)).to.equal(false);
        expect(element.classList.contains('transition-fade-out')).to.equal(false);
    });

    it('should remove the element when an animation is canceled', (done) => {
        remotion(element, 'animation-fade-out').then(() => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('animationcancel'));
    });

    it('should animate an element before removing it from the DOM', async () => {
        element.dispatchEvent(new Event('animationend'));

        await remotion(element, 'animation-fade-out');

        expect(document.contains(element)).to.equal(false);
    });

    it('should remove the element when an animation is canceled', (done) => {
        remotion(element, 'animation-fade-out').then(() => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('animationcancel'));
    });

    it('should support a callback function as a second argument that returns a class name', async () => {
        element.classList.add('transition-fade');

        const promise = remotion(element, (el) => {
            expect(el).to.equal(element);
            return 'transition-fade-out';
        });

        expect(element.classList.contains('transition-fade-out')).to.equal(true);
        
        element.dispatchEvent(new Event('transitionend'));

        await promise;

        expect(document.contains(element)).to.equal(false);
    });

    it('should remove multiple elements', async () => {
        const elements = [];
        for (let i = 0; i < 3; i++) {
            const el = document.createElement('div');
            document.body.appendChild(el);
            elements.push(el);
        }

        const promise = remotion(elements);

        expect(promise).to.be.a('promise');
        expect(document.contains(elements[0])).to.equal(false);
        expect(document.contains(elements[1])).to.equal(false);
        expect(document.contains(elements[2])).to.equal(false);

        const els = await promise;

        expect(els).to.deep.equal(Array.from(elements));
    });

    it('should transition and remove multiple elements', async () => {
        for (let i = 0; i < 3; i++) {
            const el = document.createElement('div');
            el.classList.add('box', 'transition-fade');
            document.body.appendChild(el);
        }

        const elements = document.querySelectorAll('.box');

        const promise = remotion(elements, 'transition-fade-out');

        expect(promise).to.be.a('promise');
        expect(elements[0].classList.contains('transition-fade-out')).to.equal(true);
        expect(elements[1].classList.contains('transition-fade-out')).to.equal(true);
        expect(elements[2].classList.contains('transition-fade-out')).to.equal(true);

        elements[0].dispatchEvent(new Event('transitionend'));
        elements[1].dispatchEvent(new Event('transitioncancel'));
        elements[2].dispatchEvent(new Event('transitionend'));

        const els = await promise;

        expect(els).to.deep.equal(Array.from(elements));
        expect(document.contains(elements[0])).to.equal(false);
        expect(document.contains(elements[1])).to.equal(false);
        expect(document.contains(elements[2])).to.equal(false);
        expect(elements[0].classList.contains('transition-fade-out')).to.equal(false);
        expect(elements[1].classList.contains('transition-fade-out')).to.equal(false);
        expect(elements[2].classList.contains('transition-fade-out')).to.equal(false);
    });

    it('should animate and remove multiple elements with a callback function', async () => {
        for (let i = 0; i < 3; i++) {
            const el = document.createElement('div');
            el.classList.add('box');
            document.body.appendChild(el);
        }

        const spy = sinon.spy(() => 'animation-fade-out');
        const elements = document.querySelectorAll('.box');

        const promise = remotion('.box', spy);

        expect(spy.callCount).to.equal(3);
        expect(spy.args[0][0]).to.equal(elements[0]);
        expect(spy.args[1][0]).to.equal(elements[1]);
        expect(spy.args[2][0]).to.equal(elements[2]);

        expect(elements[0].classList.contains('animation-fade-out')).to.equal(true);
        expect(elements[1].classList.contains('animation-fade-out')).to.equal(true);
        expect(elements[2].classList.contains('animation-fade-out')).to.equal(true);

        elements[0].dispatchEvent(new Event('animationend'));
        elements[1].dispatchEvent(new Event('animationcancel'));
        elements[2].dispatchEvent(new Event('animationend'));

        const els = await promise;

        expect(els).to.deep.equal(Array.from(elements));
        expect(document.contains(elements[0])).to.equal(false);
        expect(document.contains(elements[1])).to.equal(false);
        expect(document.contains(elements[2])).to.equal(false);
        expect(elements[0].classList.contains('animation-fade-out')).to.equal(false);
        expect(elements[1].classList.contains('animation-fade-out')).to.equal(false);
        expect(elements[2].classList.contains('animation-fade-out')).to.equal(false);
    });

    it('should support returning a promise from the callback function to customize when an element is removed', async () => {
        const promise = remotion(element, (el) => {
            expect(el).to.equal(element);
            return new Promise((resolve) => {
                setTimeout(resolve, 100);
            });
        });

        expect(document.contains(element)).to.equal(true);
        
        const el = await promise;

        expect(el).to.equal(element);
        expect(document.contains(element)).to.equal(false);
    });

    it('should allow the custom function to remove the element', async () => {
        const promise = remotion(element, (el) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    el.remove();
                    setTimeout(resolve, 100);
                }, 100);
            });
        });

        expect(document.contains(element)).to.equal(true);
        
        await promise;

        expect(document.contains(element)).to.equal(false);
    });

    it('should animate and remove multiple elements with a callback function that returns a promise', async () => {
        for (let i = 0; i < 3; i++) {
            const el = document.createElement('div');
            el.classList.add('box');
            document.body.appendChild(el);
        }

        const spy = sinon.spy(() => new Promise((resolve) => setTimeout(resolve, 100)));
        const elements = document.querySelectorAll('.box');

        const promise = remotion('.box', spy);

        expect(spy.callCount).to.equal(3);
        expect(spy.args[0][0]).to.equal(elements[0]);
        expect(spy.args[1][0]).to.equal(elements[1]);
        expect(spy.args[2][0]).to.equal(elements[2]);

        const els = await promise;

        expect(els).to.deep.equal(Array.from(elements));
        expect(document.contains(elements[0])).to.equal(false);
        expect(document.contains(elements[1])).to.equal(false);
        expect(document.contains(elements[2])).to.equal(false);
    });

    it('should allow an element to be re-used', (done) => {
        element.classList.add('transition-fade');

        remotion(element, 'transition-fade-out').then(() => {
            document.body.appendChild(element);
            element.addEventListener('animationend', () => {
                expect(document.contains(element)).to.equal(true);
                expect(element.classList.contains('animation-fade-out')).to.equal(true);
                done();
            });
            element.classList.add('animation-fade-out');
        });

        element.dispatchEvent(new Event('transitionend'));
    });
});
