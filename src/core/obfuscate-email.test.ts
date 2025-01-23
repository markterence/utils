import { describe, expect, it } from 'vitest';

import { obfuscateEmail } from './obfuscate-email';

describe('obfuscateEmail', () => {
  it('should obfuscate the email with default options', () => {
    const email = 'test@example.com';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('t***@ex********m');
  });

  it('should obfuscate the email with custom options', () => {
    const email = 'test@example.com';
    const options = {
      keepNameFirst: 1,
      keepNameLast: 1,
      keepDomainFirst: 1,
      keepDomainLast: 3,
    };
    const result = obfuscateEmail(email, options);
    expect(result).toBe('t**t@e******.com');
  });

  it('should handle emails with short usernames and domains', () => {
    const email = 'a@b.co';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('a@b.co');
  });

  it('should handle emails with long usernames and domains', () => {
    const email = 'averylongusername@exampleverylongdomain.com';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('av*************me@ex***************.com');
  });

  it('should handle emails with no custom options', () => {
    const email = 'user@domain.com';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('us**@do***.com');
  });
});
