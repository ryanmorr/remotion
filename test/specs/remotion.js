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

    it('should support a function as a second argument that returns a class name', (done) => {
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

    it('should remove the element when a transition is canceled', (done) => {
        element.classList.add('transition-fade');
        
        remotion(element, 'transition-fade-out').then(() => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('transitioncancel'));
    });
});
