# Contributing to NestJS DDD Boilerplate

Thank you for your interest in contributing to this NestJS DDD boilerplate! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- MySQL >= 8.0
- Redis (optional, for caching)
- RabbitMQ (optional, for message queuing)

### Setup

1. **Fork the repository**
   ```bash
   # Fork this repository to your GitHub account
   # Clone your forked repository
   git clone https://github.com/your-username/nestjs-ddd-trst.git
   cd nestjs-ddd-trst
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Database setup**
   ```bash
   mysql -u root -p -e "CREATE DATABASE nestjs_ddd_boilerplate;"
   bun run db:push
   ```

5. **Run the application**
   ```bash
   bun run start:dev
   ```

## 🏗️ Development Workflow

### Branch Naming Convention

Use descriptive branch names following these patterns:

- `feature/your-feature-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/update-documentation` - Documentation updates
- `refactor/rename-variables` - Code refactoring
- `test/add-unit-tests` - Test-related changes
- `chore/update-dependencies` - Maintenance tasks

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style and patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Run tests**
   ```bash
   bun run test
   bun run test:e2e
   bun run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## 📝 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi colons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD related changes

### Examples
```bash
feat(auth): add JWT token refresh mechanism
fix(database): resolve connection timeout issue
docs(readme): update installation instructions
test(users): add unit tests for user service
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run e2e tests
bun run test:e2e

# Run tests with coverage
bun run test:cov
```

### Test Structure

- Unit tests should be placed alongside the files they test (`*.spec.ts`)
- E2E tests should be placed in the `test/` directory
- Follow the Arrange-Act-Assert pattern in tests
- Mock external dependencies appropriately

### Testing Guidelines

- **Coverage**: Aim for high test coverage for new features
- **Test Types**: Include unit tests, integration tests, and e2e tests
- **Naming**: Use descriptive test names that explain what is being tested
- **Isolation**: Tests should be independent and not rely on each other

## 📁 Code Style and Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code formatting (Prettier is configured)
- Use descriptive variable and function names
- Add type annotations where TypeScript cannot infer types

### Code Structure

```
src/
├── modules/
│   └── your-module/
│       ├── controllers/
│       ├── services/
│       ├── dto/
│       ├── entities/
│       ├── repositories/
│       └── your-module.module.ts
├── shared/
│   ├── services/
│   ├── utils/
│   └── interfaces/
└── common/
    ├── decorators/
    ├── filters/
    └── interceptors/
```

### Best Practices

- **SOLID Principles**: Follow SOLID principles in your code design
- **DDD Patterns**: Use Domain-Driven Design patterns appropriately
- **Error Handling**: Use custom exceptions with proper error messages
- **Logging**: Use the configured Pino logger for structured logging
- **Validation**: Use class-validator for DTO validation
- **Security**: Follow security best practices (input validation, SQL injection prevention)

## 🔍 Code Review Process

### Before Submitting

1. **Self-review**: Review your own changes
2. **Tests**: Ensure all tests pass
3. **Linting**: Run `bun run lint` and fix any issues
4. **Documentation**: Update documentation if needed

### Pull Request Process

1. **Create Pull Request**
   - Use descriptive title and description
   - Link to related issues if any
   - Add screenshots for UI changes

2. **Review Requirements**
   - At least one approval is required
   - All CI checks must pass
   - Address review comments promptly

3. **Merge Process**
   - Maintain a clean commit history
   - Use squash and merge for small PRs
   - Create merge commits for significant features

## 🐛 Bug Reports

### Reporting Bugs

1. Use the issue tracker for bug reports
2. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Relevant logs or screenshots

### Bug Fix Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS 13.0]
- Node version: [e.g., 18.17.0]
- Bun version: [e.g., 1.0.0]
- Browser: [if applicable]

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### Requesting Features

1. Check if the feature already exists or is planned
2. Open an issue with the "enhancement" label
3. Provide:
   - Clear description of the feature
   - Use case and benefits
   - Implementation suggestions (optional)
   - Acceptance criteria

## 📚 Documentation

### Updating Documentation

- README.md for general project information
- API documentation via Swagger/OpenAPI
- Code comments for complex logic
- Inline documentation for public APIs

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Use consistent formatting
- Update documentation alongside code changes

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what is best for the community

### Communication

- Use GitHub for code-related discussions
- Be patient with response times
- Ask for clarification when needed
- Share knowledge and help others

## 🏷️ Labels

We use GitHub labels to categorize issues and pull requests:

- `bug`: Bug reports
- `enhancement`: Feature requests
- `documentation`: Documentation issues
- `good first issue`: Good for newcomers
- `help wanted`: Community help needed
- `priority: high`: High priority issues
- `wip`: Work in progress

## 🚨 Security

If you discover a security vulnerability, please:

1. Do not open a public issue
2. Send a private email to the maintainers
3. Include detailed information about the vulnerability
4. Allow time for us to address the issue before disclosure

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and ideas
- **Documentation**: Check existing documentation first
- **Existing Issues**: Search for similar issues before creating new ones

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks in milestone releases

## 📋 Checklist Before Submitting

- [ ] Code follows project conventions and style guidelines
- [ ] Tests are added/updated and all tests pass
- [ ] Documentation is updated if necessary
- [ ] Commit messages follow conventional commit format
- [ ] Pull request title and description are clear and descriptive
- [ ] No sensitive information is included in the code
- [ ] Dependencies are properly declared in package.json
- [ ] Security best practices are followed

Thank you for contributing to this project! 🎊