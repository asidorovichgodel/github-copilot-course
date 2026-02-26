import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

const MOBILE_BREAKPOINT = 768;

/**
 * Creates a mock matchMedia implementation that allows triggering the
 * 'change' event listener programmatically.
 */
function createMatchMediaMock() {
  let changeListener: (() => void) | null = null;

  const mock = jest.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: jest.fn((_event: string, handler: () => void) => {
      changeListener = handler;
    }),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  const triggerChange = () => {
    if (changeListener) {
      act(() => changeListener!());
    }
  };

  return { mock, triggerChange };
}

function setInnerWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
}

describe('useIsMobile()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false when window.innerWidth is at the breakpoint (768)', () => {
    // Arrange
    const { mock } = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mock,
    });
    setInnerWidth(MOBILE_BREAKPOINT);

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(false);
  });

  it('should return false when window.innerWidth is wider than the breakpoint', () => {
    // Arrange
    const { mock } = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mock,
    });
    setInnerWidth(1024);

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(false);
  });

  it('should return true when window.innerWidth is below the breakpoint', () => {
    // Arrange
    const { mock } = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mock,
    });
    setInnerWidth(375);

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(true);
  });

  it('should return true when window.innerWidth is 767 (one below breakpoint)', () => {
    // Arrange
    const { mock } = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mock,
    });
    setInnerWidth(MOBILE_BREAKPOINT - 1);

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(true);
  });

  it('should update isMobile when the media query change event fires', () => {
    // Arrange
    const { mock, triggerChange } = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mock,
    });
    setInnerWidth(1024); // start as desktop

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Act — simulate switching to mobile
    setInnerWidth(375);
    triggerChange();

    // Assert
    expect(result.current).toBe(true);
  });

  it('should remove the media query event listener on unmount', () => {
    // Arrange
    const removeEventListener = jest.fn();
    const matchMediaMock = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener,
      dispatchEvent: jest.fn(),
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaMock,
    });
    setInnerWidth(1024);

    const { unmount } = renderHook(() => useIsMobile());

    // Act
    unmount();

    // Assert
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should register a change event listener on mount', () => {
    // Arrange
    const addEventListener = jest.fn();
    const matchMediaMock = jest.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaMock,
    });
    setInnerWidth(1024);

    // Act
    renderHook(() => useIsMobile());

    // Assert
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
