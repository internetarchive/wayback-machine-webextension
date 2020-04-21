Style Guide
===========

by [Carl Gorringe](https://github.com/cgorringe)

This is a style guide for the Chrome extension code. Much of the code doesn't currently follow this guide, but you can help improve it by refactoring it. Some items are merely suggestions and there can be exceptions, so use your best judgement.

HTML / CSS
----------

#### General ####

 - Indent HTML by **2 spaces, no tabs**.
 - Indent CSS by **4 spaces, no tabs**.
 - Use only lowercase for HTML tags, attributes, CSS ids and properties.
 - Do not close void elements, e.g. use `<br>` over `<br/>`.
 - No space between CSS style and colon, then single space between colon and values: `style: values;`
 - CSS: Opening brace on same line with space between, e.g. `.tab-bar {`
 - Use double `(")` over single `(')` quotes for HTML attributes.
 - Use single `(')` over double `(")` quotes for CSS property values.

#### Naming ####

 - CSS ids and classes should be in `hyphen-style`. 
 - Try to avoid using CamelCase or underscores.


#### Example ####

```CSS
.tab-bar {
    padding: 2px 0 5px 0;
}
```

JavaScript
----------

#### General ####

 - Indent JS by **2 spaces, no tabs**.
 - Single space between keywords and parentheses and braces, except function(), e.g. `if (...) { }` or `function() { }`
 - Space following but not before: commas, colons, and semicolons.
 - Brace follow K&amp;R style. *(see example)*
 - Every statement terminated with a semicolon.
 - Prefer using `let` over `var` for variables.
 - Prefer using `let` over `const` if value will change.
 - Inlined styles in HTML is OK temporarily, but please try to move to the .css file before final submission.
 - Try to keep text that the user sees in HTML rather than embed in JS code, if possible. For example, rather than output an error message contained in JS code, you could show / hide a *span* containing the error message instead. Another example would be tooltips. Might not apply to URLs. *(optional)*

#### Naming ####

 - Function names should be in `lowerCamelCase`.
 - Class names in `UpperCamelCase`.
 - Variables can be `lowercase`, `lowerCamelCase`, or `under_scored`.
 - Global or class-scoped constants in `CONSTANT_CASE`. Locally-scoped may remain lowercased if desired.

#### Example ####

```javascript
const FOO = 5;
function fooBarBaz(pos) {
  let foo_bar;
  if (pos == 5) {
    /* do something */
  } else {
    /* something else */
  }
}
```
