# Testing Guide

*You do not need to follow this guide if you only want to try out the extension.*

This document covers steps to take for both *Automated* and *Manual Tests*. It's a good idea to check after making major code changes, prior to a *Pull Request*, and before submitting to the app stores.

This guide isn't complete. Please add additional tests. After fixing a bug, see if you can create an automated regression test, but if that isn't easy to do, please add a description for a manual test to try below.


## Formatting & Style ##

After modifying code, run **eslint** to catch basic formatting and syntax issues. This will not catch everything in the [Style Guide](STYLE_GUIDE.md), so you should review that as well. Rules are defined in the `.eslintrc.json` file.

[Getting Started with ESLint](https://eslint.org/docs/user-guide/getting-started)


#### To Install ####

If you haven't already set up your testing environment, run `npm install` to install the required packages including `eslint` which is  listed in `package.json`.

#### Running ESLint ####

Run from the root directory where `package.json` is located.

##### To see options: #####

`npx eslint`

This runs the version of eslint located at `node_modules/.bin/`. Some people install eslint globally on their system. If that is your case you may leave out the `npx` part if you want.

##### To lint a js file: #####

`npx eslint webextension/scripts/example.js`

- Recommend **not** using the `--fix` option but first try to fix it manually.

To avoid `no-undef` errors that may occur with external global variables or functions, add it to a comment around the top of the file, like so:

```
/* global fooVar, barFunc */
```


## Updating build.js (optional) ##

This doesn't have to be done but once in a great while. We recommend doing so in it's own branch or *Pull Request* instead of in a bug or feature PR that you're working on.

Sometimes the **npm** modules need updating. Most are only used in the testing environment and are not used in the final extension. The few that are used in the extension should be packed into the file `/webextension/scripts/build.js`

To recreate **build.js** run `npm run-script build` which will run webpack.


## Automated Tests ##

#### To Install ####

To setup the testing environment, run `npm install` to install required packages. This should create directory `node_modules` and populate it with modules.

#### Running Tests ####

To run tests: `npm test`.

When writing a test for `example.js` create a new file in the **test** directory named `example.spec.js`.


## Manual Tests ##

Checklist of items to test through visual inspection.

While testing API calls, a couple of tools that I find useful is the Chrome browser's DevTools Network tab, and the desktop application [Charles Proxy](https://www.charlesproxy.com).

### Context Settings ###

<table>
<tr>
  <th></th>
  <th>Tests</th>
</tr>
<tr>
<th>Replace 404s, etc...</th>
<td>

404 Page not found:
- http://purl.oclc.org/docs/inet96.html

302 Redirect to 404 above:
- http://purl.oclc.org/OCLC/PURL/INET96

410 Page has gone:
- https://medium.com/@communismkills/here-are-the-companies-that-support-antifa-black-lives-matter-and-want-you-dead-1d79b1845f59

Domain no longer exists:
- https://thekindlyones.org/2010/10/13/refusing-to-look-through-galileos-telescope/

</td>
</tr>

<tr>
<th>Wayback Machine Count</th>
<td>
Any URL
</td>
</tr>

<tr>
<th>Fact Checks</th>
<td>

Should display purple 'F' and 'Fact Check':
- http://actionnews3.com/rat-meat-has-been-sold-as-chicken-wings/
- https://worldnewsdailyreport.com/california-pro-choice-activist-proudly-breaks-world-record-by-getting-her-27th-abortion/
- https://www.intellihub.com/busted-protesters-uncover-false-flag-set-up-pile-of-bricks-strategically-placed-on-street-near-high-end-dallas-shops/
- https://biohackinfo.com/news-bill-gates-id2020-vaccine-implant-covid-19-digital-certificates/
- https://www.britannica.com/story/was-martin-luther-king-jr-a-republican-or-a-democrat

Should display purple 'F', 'Fact Check', and 'TV News Clips' (R):
- https://www.factcheck.org/2019/01/unsupported-mlk-claim-circulates-again/

</td>
</tr>

<tr>
<th>Wikipedia Resources</th>
<td>

Should display blue 'R', 'Cited Books', 'Cited Papers':
- https://en.wikipedia.org/wiki/World_War_II
- https://en.wikipedia.org/wiki/Vincent_van_Gogh
- https://en.wikipedia.org/wiki/Paper

Should display blue 'R' and 'Cited Papers', but No Books.
- https://en.wikipedia.org/wiki/Perseverance_(rover)

Should display 'F', 'Fact Check', 'Cited Books', 'Cited Papers':
- https://en.wikipedia.org/wiki/Barack_Obama

Should not display 'R':
- https://en.wikipedia.org/wiki/Main_Page

</td>
</tr>

<tr>
<th>Amazon Books</th>
<td>

Should display blue 'R' and 'Read Book':
- https://www.amazon.in/End-Days-Predictions-Prophecies-About/dp/0451226895
- https://www.amazon.com/Prophecy-What-Future-Holds-You/dp/0451215206
- https://www.amazon.com/End-Days-Jenny-Erpenbeck/dp/0811225135
- https://www.amazon.com/Sylvia-Brownes-Book-Dreams-Browne/dp/0451220293
- https://www.amazon.com/Other-Side-Back-Psychics-Beyond/dp/0451198638

</td>
</tr>

<tr>
<th>TV News Clips</th>
<td>

Should display blue 'R' and 'TV News Clips':
- https://www.huffingtonpost.com/entry/alex-jones-infowars-app-apple-google_us_5b694ec3e4b0de86f4a4bc1d
- https://www.huffpost.com/entry/alex-jones-infowars-app-apple-google_n_5b694ec3e4b0de86f4a4bc1d
- https://www.vox.com/2020/7/6/21314472/covid-19-coronavirus-us-cases-deaths-trends-wtf
- https://www.theverge.com/2018/8/29/17798118/president-donald-trump-google-state-of-the-union-address-liberal-bias
- https://edition.cnn.com/2020/08/07/economy/larry-kudlow-poppy-harlow-unemployment/index.html

</td>
</tr>

</table>

### General Settings ###

<table>
<tr>
  <th></th>
  <th>Tests</th>
</tr>

<tr>
<th>Auto Save Page</th>
<td>
TODO
</td>
</tr>

<tr>
<th>Email Outlinks</th>
<td>
TODO
</td>
</tr>

<tr>
<th>Show Resources During Save</th>
<td>
TODO
</td>
</tr>

<tr>
<th>Show Features in Tab / Window</th>
<td>
TODO
</td>
</tr>

</table>

### Features ###

<table>
<tr>
  <th></th>
  <th>Tests</th>
</tr>

<tr>
<th>Bulk Save</th>
<td>

Importing Bookmarks that are URL-encoded should be decoded in list:
- If Bookmark is: `https://www.bravovail.org/tickets-performances/2018/orchestra-concerts/the-philadelphia-orchestra/den%C3%A8ve-conducts-brahms-dvo%C5%99%C3%A1k/`
- It should look like: https://www.bravovail.org/tickets-performances/2018/orchestra-concerts/the-philadelphia-orchestra/denève-conducts-brahms-dvořák/

</td>
</tr>

</table>

