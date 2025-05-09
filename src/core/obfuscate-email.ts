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

/**
 * Obfuscates an email address by replacing parts of the username and domain with a specified character.
 *
 * @param emailStr - The email address to obfuscate.
 * @param replaceOptions - Optional settings to customize the obfuscation process.
 * @returns The obfuscated email address.
 *
 * @example
 * ```ts
 * const email = 'foo@example.com';
 * const result = obfuscateEmail(email); // f**@ex*****e.c**
 * ```
 */
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

  // Rare case where the username is only one character.
  // In this case, just obfuscate the entire username.
  // ProtonMail does auction off single character usernames, like 'x@proton.me'.
  // Self-hosted email servers may also allow single character usernames.
  if (emailUsername.length === 1) {
    defaults.keepNameFirst = 0;
    defaults.keepNameLast = 0;
  }

  const censoredUsername = obfuscateString(emailUsername, {
    replacementChar: defaults.replacementChar,
    keepFirst: defaults.keepNameFirst,
    keepLast: defaults.keepNameLast,
    keepSpace: false,
  });

  // Sometimes, the domain has multiple parts, such as 'example.co.uk'.
  // Or sometimes it has a subdomain, such as 'sub.example.com' or combinations of both.
  // In these cases, we need to split the domain into parts and obfuscate each part separately.
  const domainParts = emailDomain.split('.');

  const censoredDomainParts = domainParts.map((part) => {
    let keepFirst = defaults.keepDomainFirst;
    let keepLast = defaults.keepDomainLast;

    if (part.length === 1) {
      return defaults.replacementChar;
    }

    if (part.length === 2) {
      return part[0] + defaults.replacementChar;
    }

    if (part.length <= keepFirst! + keepLast!) {
      keepFirst = 1;
      keepLast = 0;
    }

    if (keepLast! > part.length) {
      keepLast = 0;
    }

    return obfuscateString(part, {
      replacementChar: defaults.replacementChar,
      keepFirst,
      keepLast,
      keepSpace: false,
    });
  });

  const censoredDomain = censoredDomainParts.join('.');

  return `${censoredUsername}@${censoredDomain}`;
}
