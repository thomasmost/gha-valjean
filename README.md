# gha-valjean

A GitHub Action for validating JSON files against a remote schema

On the backend, this uses AJV to perform the validation

## Inputs

### `schema-url`

Url to the remote schema JSON file to validate against

### `target-dir`

Comma-separated list directories to validate

### `all-errors` (optional)

Enables 'all errors' validation on AJV

### `ajv-strict` (optional)

Enables 'strict mode' in AJV

### `draft-version` (optional)

The JSON schema draft version (defaults to 2019)—only supports '2020' and '2019'

## Example Usage

You can use this action to generate artifacts with the type bindings in your preferred languages.

For example, you might design a workflow to generate bindings for both TypeScript and Rust, e.g.

```yml
name: Build
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: API Schema
        uses: thomasmost/gha-valjean@0.1.0
        with:
          schema-url: https://raw.githubusercontent.com/thomasmost/gha-valjean/main/schema/example.schema.json
          target-dir: samples
```
