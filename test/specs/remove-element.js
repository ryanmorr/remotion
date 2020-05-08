import removeElement from '../../src/remove-element';

describe('remove-element', () => {
    function createStyle(css) {
        const style = document.createElement('style');
        style.classList.add('test-css');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    afterEach(() => document.querySelectorAll('.test-css').forEach((style) => style.remove()));

    it('should transition an element before removing it from the DOM', (done) => {
        createStyle(`
            .foo {
                opacity: 1;
                transition: opacity 0.5s ease-out;
            }
            
            .fade-out {
                opacity: 0;
            }
        `);

        const element = document.createElement('div');
        element.classList.add('foo');
        document.body.appendChild(element);

        const addEventSpy = sinon.spy(element, 'addEventListener');
        const removeEventSpy = sinon.spy(element, 'removeEventListener');

        const promise = removeElement(element, 'fade-out');

        expect(promise).to.be.a('promise');
        expect(element.classList.contains('fade-out')).to.equal(true);

        expect(addEventSpy.callCount).to.equal(1);
        expect(addEventSpy.args[0][0]).to.equal('transitionend');
        expect(removeEventSpy.callCount).to.equal(0);

        promise.then((el) => {
            expect(el).to.equal(element);
            expect(document.contains(element)).to.equal(false);
            expect(element.parentNode).to.equal(null);
            expect(element.classList.contains('fade-out')).to.equal(false);
            expect(removeEventSpy.callCount).to.equal(1);
            done();
        });

        element.dispatchEvent(new Event('transitionend'));
    });

    it('should support selector strings', (done) => {
        createStyle(`
            .foo {
                opacity: 1;
                transition: opacity 0.5s ease-out;
            }
            
            .fade-out {
                opacity: 0;
            }
        `);

        const element = document.createElement('div');
        element.classList.add('foo');
        document.body.appendChild(element);

        removeElement('.foo', 'fade-out').then((el) => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('transitionend'));
    });

    it('should support a function as a second argument that returns a class name', (done) => {
        const element = document.createElement('div');
        element.classList.add('foo');
        document.body.appendChild(element);

       const promise = removeElement(element, () => 'fade-out');

        expect(element.classList.contains('fade-out')).to.equal(true);
        
        promise.then((el) => {
            expect(document.contains(element)).to.equal(false);
            done();
        });

        element.dispatchEvent(new Event('transitionend'));
    });
});
