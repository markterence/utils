import { obfuscateString } from './obfuscate-string';

interface ObfuscateEmailOptions {
  /**
   * The number of characters to keep from the start of the name.
   */

  keepNameFirst?: number;
  /**
   * The number of characters to keep from the end of the name.
   */
  keepNameLast?: number;

  /**
   * The number of characters to keep from the start of the domain.
   */
  keepDomainFirst?: number;

  /**
   * The number of characters to keep from the end of the domain.
   * This will include the tld(.com, .org, .net, etc).
   */
  keepDomainLast?: number;

  /**
   * The character to use as a replacement for obfuscation.
   * Default is '*'.
   */
  replacementChar?: string;
}

const defaultOptions: ObfuscateEmailOptions = {
  keepNameFirst: 2,
  keepNameLast: 2,
  keepDomainFirst: 2,
  keepDomainLast: 1,
  replacementChar: '*',
};

export function obfuscateEmail(emailStr: string, replaceOptions: ObfuscateEmailOptions = {}): string {
  const defaults = { ...defaultOptions, ...replaceOptions };
  const parts = emailStr.split('@');

  const emailUsername = parts[0];
  const emailDomain = parts[1];

  // When the username falls within the keep range, keep only the first character and obfuscate the rest.
  if (emailUsername.length <= defaults.keepNameFirst! + defaults.keepNameLast!) {
    defaults.keepNameFirst = 1;
    defaults.keepNameLast = 0;
  }

  // When the domain falls within the keep range, keep only the first character and obfuscate the rest.
  if (emailDomain.length <= defaults.keepDomainFirst! + defaults.keepDomainLast!) {
    defaults.keepDomainFirst = 1;
    defaults.keepDomainLast = 0;
  }

  const censoredUsername = obfuscateString(emailUsername, {
    replacementChar: defaults.replacementChar,
    keepFirst: defaults.keepNameFirst,
    keepLast: defaults.keepNameLast,
    keepSpace: false,
  });

  const censoredDomain = obfuscateString(emailDomain, {
    replacementChar: defaults.replacementChar,
    keepFirst: defaults.keepDomainFirst,
    keepLast: defaults.keepDomainLast,
    keepSpace: false,
  });

  return `${censoredUsername}@${censoredDomain}`;
}
