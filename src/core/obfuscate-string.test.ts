import { describe, expect, it } from 'vitest';
import { obfuscateString } from './obfuscate-string';

describe('obfuscateString', () => {
  it('should obfuscate the middle part of the string with default settings', () => {
    const result = obfuscateString('HelloWorld');
    expect(result).toBe('Hell*****');
  });

  it('should obfuscate the middle part of the string with custom replacementChar', () => {
    const result = obfuscateString('HelloWorld', { replacementChar: '#' });
    expect(result).toBe('Hell#####');
  });

  it('should keep the first and last characters as specified', () => {
    const result = obfuscateString('HelloWorld', { keepFirst: 2, keepLast: 3 });
    expect(result).toBe('He****rld');
  });

  it('should keep spaces if keepSpace is true', () => {
    const result = obfuscateString('Hello World', { keepSpace: true });
    expect(result).toBe('Hell* *****');
  });

  it('should obfuscate spaces if keepSpace is false', () => {
    const result = obfuscateString('Hello World', { keepSpace: false });
    expect(result).toBe('Hell******');
  });

  it('should handle empty string', () => {
    const result = obfuscateString('');
    expect(result).toBe('');
  });

  it('should handle string shorter than keepFirst + keepLast', () => {
    const result = obfuscateString('Hi', { keepFirst: 2, keepLast: 2 });
    expect(result).toBe('Hi');
  });

  it('should handle string with only spaces', () => {
    const result = obfuscateString('     ', { keepSpace: true });
    expect(result).toBe('     ');
  });
});
