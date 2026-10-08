# Code Review & Mentorship Guidelines

## 1. Purpose

The purpose of this guide is to establish a consistent approach to code reviews and technical mentorship.

Code reviews should improve code quality, maintainability, reliability, security, and knowledge sharing while keeping feedback constructive and actionable.

## 2. Code Review Principles

### Correctness

Verify that the implementation:

- Meets the intended requirements.
- Handles expected inputs correctly.
- Handles invalid inputs appropriately.
- Does not introduce regressions.
- Produces the expected API responses.

### Maintainability

Review for:

- Clear naming
- Simple and readable logic
- Appropriate separation of concerns
- Reusable components or services where appropriate
- Avoidance of unnecessary duplication
- Consistent project conventions

### Type Safety

For TypeScript code:

- Avoid unnecessary `any` usage.
- Use appropriate interfaces and types.
- Ensure type assertions are justified.
- Verify that error handling preserves type safety.

### Error Handling

Check that:

- Expected errors return appropriate HTTP status codes.
- Error messages are meaningful.
- Database errors are handled safely.
- Internal implementation details are not unnecessarily exposed.

### Testing

Reviewers should verify that appropriate tests exist for:

- New functionality
- Critical business logic
- Negative scenarios
- Regression-prone areas

Tests should be readable, deterministic, and focused on behavior.

### Security

Review for common risks including:

- Improper input handling
- Sensitive information exposure
- Weak authentication or authorization controls
- Unsafe database operations
- Insecure configuration

Secrets should never be committed to source control.

## 3. Review Process

A typical review should follow these steps:

1. Understand the purpose of the change.
2. Review the implementation for correctness.
3. Check error handling and edge cases.
4. Review tests and test coverage.
5. Check maintainability and project conventions.
6. Check for security concerns.
7. Run relevant automated tests.
8. Provide clear and actionable feedback.
9. Approve when the change meets the required quality standard.

## 4. Severity of Review Comments

### Blocking

Use blocking comments for issues that:

- Cause incorrect functionality
- Break builds or tests
- Introduce significant security risks
- Cause data corruption or loss
- Create serious production reliability problems

### Important

Use important comments for:

- Significant maintainability problems
- Missing important validation
- Missing tests for critical functionality
- Poor error handling

### Suggestion

Use suggestions for:

- Readability improvements
- Naming improvements
- Simplification
- Minor refactoring
- Style improvements

Suggestions should not unnecessarily block delivery.

## 5. Feedback Guidelines

Good review feedback should be:

- Specific
- Respectful
- Actionable
- Focused on the code rather than the person
- Supported by a technical reason when appropriate

Instead of:

> This code is bad.

Prefer:

> This error path returns a successful response even when the database operation fails. Consider handling the unique constraint error explicitly and returning a conflict response.

## 6. Mentorship Approach

Code reviews should also be treated as learning opportunities.

When reviewing work from a less experienced developer:

- Explain why a change is recommended.
- Provide examples when useful.
- Encourage questions.
- Focus on improving understanding rather than simply correcting the code.
- Recognize good implementation decisions as well as problems.

For recurring issues, provide guidance or documentation rather than repeatedly leaving the same review comment.

## 7. Pre-Merge Checklist

Before approving a pull request, verify:

- [ ] Requirements are satisfied.
- [ ] Code builds successfully.
- [ ] Linting passes.
- [ ] Relevant unit tests pass.
- [ ] Relevant API or integration tests pass.
- [ ] Error handling is appropriate.
- [ ] No secrets are committed.
- [ ] No unnecessary code or dependencies were added.
- [ ] Documentation is updated when necessary.
- [ ] The implementation follows project conventions.

## 8. Definition of Done

A change is considered ready for merge when:

- Required functionality is implemented.
- Relevant tests pass.
- Critical review comments are resolved.
- No known blocking defects remain.
- The code meets project quality and security expectations.

## 9. Continuous Improvement

Review feedback should be used to improve team practices over time.

Recurring defects should be analyzed to determine whether:

- Additional automated tests are needed.
- Documentation should be improved.
- Coding standards should be updated.
- The development process should be changed.

The goal of code review is not only to catch defects but also to continuously improve engineering quality and team knowledge.