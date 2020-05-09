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

    it('should transition an element before removing it from the DOM', (done) => {
        element.classList.add('transition-fade');

        const promise = remotion(element, 'transition-fade-out');

        expect(promise).to.be.a('promise');
        expect(element.classList.contains('transition-fade-out')).to.equal(true);

        promise.then((el) => {
            expect(el).to.equal(element);
            expect(document.contains(element)).to.equal(false);
            expect(element.classList.contains('transition-fade-out')).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('transitionend'));
    });

    it('should support selector strings', (done) => {
        element.classList.add('foo', 'transition-fade');

        remotion('.foo', 'transition-fade-out').then(() => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('transitionend'));
    });

    it('should remove the element when a transition is canceled', (done) => {
        element.classList.add('transition-fade');

        remotion(element, 'transition-fade-out').then(() => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('transitioncancel'));
    });

    it('should animate an element before removing it from the DOM', (done) => {
        remotion(element, 'animation-fade-out').then(() => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('animationend'));
    });

    it('should remove the element when an animation is canceled', (done) => {
        remotion(element, 'animation-fade-out').then(() => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('animationcancel'));
    });

    it('should support a callback function as a second argument that returns a class name', (done) => {
        element.classList.add('transition-fade');

        const promise = remotion(element, (el) => {
            expect(el).to.equal(element);
            return 'transition-fade-out';
        });

        expect(element.classList.contains('transition-fade-out')).to.equal(true);
        
        promise.then(() => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('transitionend'));
    });

    it('should support a second parameter to the callback function to customize when an element is removed', (done) => {
        const promise = remotion(element, (el, done) => {
            expect(done).to.be.a('function');
            setTimeout(done, 1000);
        });

        expect(document.contains(element)).to.equal(true);
        
        promise.then((el) => {
            expect(el).to.equal(element);
            expect(document.contains(element)).to.equal(false);
            done();
        });
    });
});
