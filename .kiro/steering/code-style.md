---
inclusion: always
---

# Code Style — ESLint + Prettier

This project enforces consistent formatting via Prettier and code quality via ESLint.
**Always follow these rules exactly. Never deviate from them when writing or editing code.**

## Formatter: Prettier

Config is in `.prettierrc` at the project root. The canonical rules are:

| Rule | Value |
|------|-------|
| Indentation | **Tabs** (not spaces) |
| Quotes (JS/TS) | **Single quotes** `'` |
| Quotes (JSX attributes) | **Double quotes** `"` |
| Semicolons | **None** (no trailing `;`) |
| Trailing commas | `es5` — trailing commas in objects/arrays, not function params |
| Print width | `80` characters |
| Arrow function parens | Omit when single param: `x => x` not `(x) => x` |
| Line endings | `LF` |

### Critical formatting rules for agents

- **Use tabs for indentation everywhere** — never spaces
- **No semicolons** at end of statements
- **Single quotes** for all JS strings: `'hello'` not `"hello"`
- **Double quotes** for JSX props: `className="foo"` not `className='foo'`
- **Trailing comma** after last item in multi-line objects and arrays
- Keep lines under 80 chars where practical

## Linter: ESLint

### Client (`client/src/**`)

Config: `client/.eslintrc.cjs`

- `react/prop-types` is **off** — no PropTypes needed
- `no-unused-vars` — warn (prefix unused vars/args with `_` to suppress)
- `no-console` — warn; only `console.warn` and `console.error` are allowed
- `prefer-const` — error; always use `const` unless reassignment is needed
- `no-var` — error; never use `var`
- `eqeqeq` — error; always use `===` not `==`
- `no-duplicate-imports` — error

### Backend (`backend/**`)

Config: `.eslintrc.cjs` at root

- Same quality rules as client
- `console.log` is additionally allowed (server-side logging)

## Running the tools

```bash
# Client
cd client
npm run lint          # check for ESLint errors
npm run lint:fix      # auto-fix ESLint errors
npm run format        # format all src files with Prettier
npm run format:check  # check formatting without writing

# Backend
npm run lint          # check backend/ with ESLint
npm run lint:fix      # auto-fix backend/
npm run format        # format backend/ with Prettier
npm run format:check  # check formatting without writing
```

## What agents must do

1. **Match the style of surrounding code** — if the file uses tabs and single quotes, keep that
2. **Never introduce spaces for indentation** in files that use tabs
3. **Never add semicolons** to JS/JSX files in this project
4. **Never switch quote style** mid-file
5. After editing a file, the result must be valid according to `.prettierrc` and the relevant `.eslintrc.cjs`
6. Do not add `// eslint-disable` comments unless there is a specific, documented reason
7. Do not add `/* eslint-disable react/prop-types */` file-level suppression to new files — prop-types is already turned off globally
