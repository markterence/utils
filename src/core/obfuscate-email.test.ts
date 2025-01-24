import { describe, expect, it } from 'vitest';

import { obfuscateEmail } from './obfuscate-email';

describe('obfuscateEmail', () => {
  it('should obfuscate the email with default options', () => {
    const email = 'test@example.com';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('t***@ex****e.c**');
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
    expect(result).toBe('t**t@e***ple.c**');
  });

  it('should obfuscate the email with partial options', () => {
    const email = 'test@example.com';
    const options = {
      keepNameFirst: 1,
      keepDomainLast: 3,
    };
    const result = obfuscateEmail(email, options);
    expect(result).toBe('t*st@ex**ple.c**');
  });

  it('should handle emails with short usernames and domains', () => {
    const email = 'a@b.co';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('*@*.c*');
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

  it('should handle emails with subdomains', () => {
    const email = 'user@sub.example.com';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('us**@su*.ex******m');
  });

  it('should handle emails with multiple domain parts', () => {
    const email = 'user@example.co.uk';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('us**@ex******.co.uk');
  });

  it('should handle emails with single character domain parts', () => {
    const email = 'user@e.co';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('us**@e.co');
  });

  it('should handle emails with two character domain parts', () => {
    const email = 'user@ex.co';
    const result = obfuscateEmail(email, {});
    expect(result).toBe('us**@ex.co');
  });

  it('should handle emails with custom replacement character', () => {
    const email = 'user@domain.com';
    const options = {
      replacementChar: '#',
    };
    const result = obfuscateEmail(email, options);
    expect(result).toBe('us##@do###.com');
  });
});
