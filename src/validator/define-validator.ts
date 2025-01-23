export interface ValidatorResult {
  valid: boolean;
  issue?: unknown;
};

export function defineValidator<T>(setup: () => T): T;
export function defineValidator(setup: () => unknown): unknown {
  if (typeof setup !== 'function') {
    throw new TypeError('The setup argument must be a function.');
  }

  const result = setup();

  return result;
}
