import { describe, expect, it } from 'vitest';
import { defineValidator } from '../src/validator/define-validator';

describe('defineValidator types', () => {
  it('can define a validator with a function', () => {
    const postValidator = defineValidator(() => {
      const baseSchema = () => {};

      const validate = (_unusedData: any) => {
        return { valid: true };
      };

      return {
        baseSchema,
        validate,
      };
    });

    const data = {
      title: 'Hello, world!',
      body: 'This is a test post.',
    };

    expect(postValidator.validate(data)).toStrictEqual({ valid: true });
  });
});
