# Typescript Dependency Injection Library

![Build status](https://travis-ci.org/vdubois/typescript-inject.svg?branch=master)

## Goal

The goal of this package is to provide a simple Dependency Injection library without decorators to Typescript

## Examples

### Registering instances

```js
register('ConfigurationService', () => new ConfigurationService());
```

### Using instances

```js
const configurationService = inject<ConfigurationService>('ConfigurationService');
```

### Todos

* Handling singletons
