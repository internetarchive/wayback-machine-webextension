# Style Guide

This is a style guide for the Web Extension code. Some of the code may not currently follow this guide, but you can help improve it by refactoring it. Some items are merely suggestions and there can be exceptions, so use your best judgement.


## HTML / CSS ##

#### General ####

 - Indent HTML by **2 spaces, no tabs**.
 - Indent CSS by **4 spaces, no tabs**.
 - Use only lowercase for HTML tags, attributes, CSS ids and properties.
 - Do not close void elements, e.g. use `<br>` over `<br/>`.
 - No space between CSS style and colon, then single space between colon and values: `style: values;`
 - CSS: Opening brace on same line with space between, e.g. `.tab-bar {`
 - Use double `(")` over single `(')` quotes for HTML attributes.
 - Use single `(')` over double `(")` quotes for CSS property values.
 - Inlined styles in HTML is OK temporarily, but please try to move to the .css file before final submission.

#### Naming ####

 - CSS ids and classes should be in `hyphen-style`. 
 - Try to avoid using CamelCase or underscores.


#### Example ####

```CSS
.tab-bar {
    padding: 2px 0 5px 0;
}
```

## JavaScript ##

#### General ####

 - Indent JS by **2 spaces, no tabs**.
 - Single space between keywords and parentheses and braces, except function(), e.g. `if (...) { }` or `function() { }`
 - Space following but not before: commas, colons, and semicolons.
 - Braces follow K&amp;R style. *(see example)*
 - Omit semicolons at end of lines.
 - Prefer single quotes `(')` around strings instead of double-quotes.
 - Prefer using `let` over `var` for variables.
 - Prefer using `let` over `const` if value will change.
 - Place any external globals used in a comment for ESLint like this:
   `/* global var1, var2 */`

#### Naming ####

 - Function names should be in `lowerCamelCase`.
 - Class names in `UpperCamelCase`.
 - Variables can be `lowercase`, `lowerCamelCase`, or `under_scored`.
 - Global or class-scoped constants in `CONSTANT_CASE`. Locally-scoped may remain lowercased if desired.

#### Example ####

```javascript
const FOO = 5
function fooBarBaz(pos) {
  let fooBar
  if (pos === FOO) {
    /* do something */
  } else {
    /* something else */
  }
}
```

## Using ESLint ##

Using *eslint* will catch some basic formatting and syntax issues. It does not currently catch everything in the Style Guide above. 

Please follow the directions in the [Testing Guide](TESTING_GUIDE.md) section on **Formatting & Style** for details.

