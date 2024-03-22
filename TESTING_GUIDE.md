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


## Updating Dependencies ##

Github's Dependabot may alert potential security issues in dependencies.

To view and fix these issues:

```
npm audit
npm audit fix
npm update
```


## (NOT) Updating build.js (optional) ##

*We are no longer generating build.js, but instead using javascript frameworks directly.* All code must be readable and non-minified to pass Firefox code review, so no longer using webpack for the main webextension code. Libraries such as jQuery and Bootstrap are to be located in the `libs` directory.

#### Old Info ####

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
<th>Wayback Machine Count</th>
<td>
Any URL
</td>
</tr>

<tr>
<th>Replace 404s, etc...</th>
<td>

404 Page not found:
- https://www.whitehouse.gov/energy/climate-change
- http://purl.oclc.org/docs/inet96.html

410 Page has gone:
- https://medium.com/@communismkills/here-are-the-companies-that-support-antifa-black-lives-matter-and-want-you-dead-1d79b1845f59

Domain no longer exists:
- http://mercedesfan.store/

</td>
</tr>

<tr>
<th>Contextual Notices</th>
<td>

Should display yellow dot, 'Show Context':
- https://www.capradio.org/articles/2019/02/12/text-and-analysis-state-of-the-state-2019

Should return data but NOT display yellow dot:
- https://www.oralhealthgroup.com/features/face-masks-dont-work-revealing-review/
- https://jhunewsletter.com/article/2020/11/a-closer-look-at-u-s-deaths-due-to-covid-19
- https://chicagotribune.com/coronavirus/fl-ne-miami-doctor-vaccine-death-20210107-afzysvqqjbgwnetcy5v6ec62py-story.html

404 Not Found with Context Notice:
- https://ria.ru/20220226/rossiya-1775162336.html

</td>
</tr>

<tr>
<th>Wikipedia Resources</th>
<td>

Should display blue 'R', 'Cited Books', 'Cited Papers':
- https://en.wikipedia.org/wiki/World_War_II
- https://en.wikipedia.org/wiki/Vincent_van_Gogh
- https://en.wikipedia.org/wiki/Paper
- https://en.wikipedia.org/wiki/Barack_Obama

Should display blue 'R' and 'Cited Papers', but No Books.
- https://en.wikipedia.org/wiki/Perseverance_(rover)

Should display blue 'R' and 'Cited Books', but No Papers.
- https://en.wikipedia.org/wiki/Bob_Marley

Should not display 'R':
- https://en.wikipedia.org/wiki/Main_Page

Other domains & languages:
- https://en.m.wikipedia.org/wiki/Paper
- https://simple.wikipedia.org/wiki/Paper
- https://es.wikipedia.org/wiki/Papel
- https://fr.wikipedia.org/wiki/Papier
- https://de.wikipedia.org/wiki/Papier

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
- https://www.huffpost.com/entry/dan-kildee-brother-killed-michigan_n_65fae2dfe4b0947e4200e49d
- https://edition.cnn.com/2024/03/12/media/cnbc-trump-interview-lies/index.html
- https://www.theverge.com/2018/8/29/17798118/president-donald-trump-google-state-of-the-union-address-liberal-bias
- https://edition.cnn.com/2024/03/19/politics/texas-immigration-law-blocked-appeals/index.html?iid=cnn_buildContentRecirc_end_recirc
- https://edition.cnn.com/europe/live-news/ukraine-russia-news-02-23-22/h_6d205f365f501bc935268528b826a824

List of websites checked:
- 'apnews.com', 'www.factcheck.org', 'www.forbes.com', 'www.huffpost.com', 'www.nytimes.com', 'www.politico.com', 'www.politifact.com', 'www.snopes.com', 'www.theverge.com', 'www.usatoday.com', 'www.vox.com', 'www.washingtonpost.com', 'edition.cnn.com'

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

### General ###

<table>
<tr>
  <th></th>
  <th>Tests</th>
</tr>

<tr>
<th>URLs</th>
<td>

In Bulk Save, check that *Import All Bookmarks* will decode when adding URLs to list: [#729](https://github.com/internetarchive/wayback-machine-webextension/issues/729)
- If Bookmark is: `https://www.bravovail.org/tickets-performances/2018/orchestra-concerts/the-philadelphia-orchestra/den%C3%A8ve-conducts-brahms-dvo%C5%99%C3%A1k/`
- It should look like: https://www.bravovail.org/tickets-performances/2018/orchestra-concerts/the-philadelphia-orchestra/denève-conducts-brahms-dvořák/

Test that SPN works on URLs containing percent-encodings: [#279](https://github.com/internetarchive/wayback-machine-webextension/issues/279)
- https://www.courthousenews.com/%EF%BB%BFopponents-of-drag-queen-story-hour-tossed-from-court/

Check above URLs work with Wayback (Oldest, Overview, Newest), Social Links, Copy to Clipboard.

Test that URLs which are excluded from the Wayback Machine don't Auto-Save, buttons disabled, message shows. See issue [#944](https://github.com/internetarchive/wayback-machine-webextension/issues/944) and [PR #951](https://github.com/internetarchive/wayback-machine-webextension/pull/951) for screenshots.
- Example: https://www.tomshardware.com/

</td>
</tr>

</table>

