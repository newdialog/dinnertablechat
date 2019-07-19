// react-testing-library renders your components to document.body,
// this will ensure they're removed after each test.
import '@testing-library/react/cleanup-after-each';
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect'
import 'jest-extended';

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

(global as any).localStorage = localStorageMock;

(global as any).trackOutboundLinkClick = jest.fn();
(global as any).gtag = jest.fn();

(global as any).IntersectionObserver = function() {
    return {observe:jest.fn(), unobserve: jest.fn()}
}