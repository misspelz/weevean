# Contributing to Weevean

Thank you for your interest in contributing to Weevean! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- Be respectful and considerate in your language and actions
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, intimidation, or discrimination of any kind
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Git
- A code editor (VS Code recommended)
- Neon Database account (free tier)

---

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `dev` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Making Changes

1. **Make your changes** in your feature branch
2. **Test locally** to ensure everything works
3. **Commit your changes** following commit guidelines
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create Pull Request** on GitHub

---

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define types for all function parameters and returns
- Avoid `any` type (use `unknown` if necessary)
- Use interfaces for objects, types for unions/intersections

### File Naming

- Components: `PascalCase.tsx` (e.g., `MessageList.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- Types: `kebab-case.ts` (e.g., `user-types.ts`)
- API routes: `route.ts` (Next.js convention)

### Code Formatting

- Follow our predefined Prettier rules

Run before committing:

```bash
pnpm run format
```

### ESLint Rules

- No unused variables
- Prefer `const` over `let`
- No `console.log` in production code (use proper logging)
- Exhaustive dependency arrays in `useEffect`

Run linter:

```bash
pnpm run lint
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature change or bug fix)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, tooling, dependencies

### Examples

```bash
feat(chat): add message reactions
fix(auth): resolve login redirect loop
docs: update setup instructions in README
refactor(api): simplify workspace queries
chore(deps): update Next.js to v15.1
```

### Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor" not "moves cursor")
- Keep subject line under 72 characters
- Reference issues in footer (e.g., "Closes #123")

---

## Pull Request Process

### Before Submitting

1. **Update from upstream**

   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests** (when available)

   ```bash
   pnpm test
   ```

3. **Lint your code**

   ```bash
   pnpm run lint
   ```

4. **Format your code**
   ```bash
   pnpm run format
   ```

### PR Title

Follow same format as commit messages:

```
feat(chat): add message reactions
```

### PR Description Template

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

Describe the tests you ran.

## Screenshots (if applicable)

Add screenshots for UI changes.

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes locally

## Related Issues

Closes #123
```

### Review Process

1. **Automated checks** must pass (linting, formatting)
2. **One approving review** required from maintainer
3. **All conversations resolved** before merge
4. **Rebase and merge** strategy used (no merge commits)

### After Merge

1. **Delete your branch** locally and on GitHub
2. **Update your main branch**
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## Testing

### Manual Testing

Before submitting PR, test these workflows:

1. **Authentication**

   - Sign up with new account
   - Verify email works
   - Log in and log out

2. **Workspaces**

   - Create new workspace
   - Switch between workspaces
   - Generate invite link

3. **Channels**

   - Create public channel
   - Send messages
   - Add reactions

4. **Direct Messages**

   - Start DM with user
   - Send messages in DM

5. **Edge Cases**
   - Empty states (no workspaces, no messages)
   - Long messages (> 1000 characters)
   - Special characters in channel names

### Automated Testing (Future)

When test suite is added:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage
```

---

## Getting Help

### Questions?

- **Weevean**: Join our workspace - link in README (Future)
- **Slack**: Join our #weevean-community (link in README)
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Search existing issues first

### Reporting Bugs

Use the bug report template:

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment**

- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 18.17.0]
```

### Suggesting Features

Use the feature request template:

```markdown
**Problem Statement**
Describe the problem this feature solves

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other solutions you've thought about

**Additional Context**
Any other information
```

---

Thank you for contributing to Weevean! Your efforts help make this project better for everyone.
