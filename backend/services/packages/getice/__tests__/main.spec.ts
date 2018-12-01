describe('greeter function', () => {
  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  const name: string = 'John';

  // Act before assertions
  beforeAll(async () => {
    jest.runOnlyPendingTimers();
  });

  // Assert if setTimeout was called properly
  it('delays the greeting by 2 seconds', () => {
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  // Assert greeter result
  it('greets a user with `Hello, {name}` message', () => {});
});
