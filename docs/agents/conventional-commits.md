# Conventional Commits 1.0.0

## Summary

Conventional Commits is a lightweight convention for commit messages. It makes history easier to read, helps automated tooling, and maps naturally to SemVer by describing features, fixes, and breaking changes.

## Commit Structure

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types and Meaning

- `feat`: introduces a new feature. Maps to a SemVer minor release.
- `fix`: patches a bug. Maps to a SemVer patch release.
- `BREAKING CHANGE`: indicates a breaking API change. Maps to a SemVer major release.
- Other types such as `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, and `test` are also allowed.
- A scope may be added in parentheses, such as `feat(parser): add array parsing`.

## Rules

- The commit type must come first, followed by an optional scope, then a colon and space.
- The description must be a short summary of the change.
- An optional body may follow after one blank line.
- One or more footers may follow after another blank line.
- Footers should use git-trailer-style formatting.
- Breaking changes may appear either in the type prefix using `!` or in a `BREAKING CHANGE:` footer.
- `BREAKING-CHANGE` is treated as synonymous with `BREAKING CHANGE` in footer tokens.

## Examples

### Simple feature

```text
feat: allow provided config object to extend other configs
```

### Breaking change in the footer

```text
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

### Breaking change with `!`

```text
feat!: drop support for Node 6
```

### Scoped feature

```text
feat(lang): add Polish language
```

### Fix with body and footers

```text
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Reviewed-by: Z
Refs: #123
```

## Why Use Conventional Commits

- Automatically generate changelogs.
- Automatically determine semantic version bumps.
- Communicate the nature of changes to teammates and stakeholders.
- Trigger build and publish processes.
- Keep history structured and easier to contribute to.

## FAQ

### How should I deal with commit messages in the initial development phase?

Proceed as if the product has already been released. People still need to know what changed, what is fixed, and what breaks.

### Are the types in the commit title uppercase or lowercase?

Any casing may be used, but consistency is recommended.

### What do I do if the commit conforms to more than one type?

Make multiple commits whenever possible. That keeps the history clearer.

### Doesn’t this discourage rapid development and fast iteration?

It discourages moving fast in a disorganized way. It helps teams move quickly over time.

### How does this relate to SemVer?

- `fix` -> PATCH
- `feat` -> MINOR
- Any commit with `BREAKING CHANGE` -> MAJOR

### How should I version my own extensions to this specification?

Use SemVer for your own extensions as well.

### What do I do if I accidentally use the wrong commit type?

Before merging or releasing, consider rewriting history with `git rebase -i`. After release, the cleanup depends on your workflow and tooling.

### Do all contributors need to use the specification?

No. Squash-based workflows can keep commit history consistent without forcing every contributor to write perfect commit messages.

### How does Conventional Commits handle revert commits?

The spec does not define revert behavior explicitly. A common pattern is to use a `revert:` commit with a footer referencing the reverted SHAs.

```text
revert: let us never again speak of the noodle incident

Refs: 676104e, a215868
```