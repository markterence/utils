# `obfuscate-email`

## Usage

```js
import { obfuscateEmail } from '@markterence/utils/core';

obfuscateEmail('user@example.com');

// Output: 'u***@e********m'
```

## Options

### `keepNameFirst`

- **Type:** `number`
- **Description:** The number of characters to keep from the start of the name.

### `keepNameLast`

- **Type:** `number`
- **Description:** The number of characters to keep from the end of the name.

### `keepDomainFirst`

- **Type:** `number`
- **Description:** The number of characters to keep from the start of the domain.

### `keepDomainLast`

- **Type:** `number`
- **Description:** The number of characters to keep from the end of the domain. This will include the TLD (.com, .org, .net, etc).

### `replacementChar`

- **Type:** `string`
- **Default:** `'*'`
- **Description:** The character to use as a replacement for obfuscation.

## Example Usage

```typescript
import { obfuscateEmail } from './obfuscate-email';

const email = 'test@example.com';
const options = {
  keepNameFirst: 1,
  keepNameLast: 1,
  keepDomainFirst: 1,
  keepDomainLast: 3,
  replacementChar: '*'
};

const obfuscatedEmail = obfuscateEmail(email, options);
console.log(obfuscatedEmail); // Output: t**t@e******.com
```
