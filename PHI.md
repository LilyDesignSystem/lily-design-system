# PHI, privacy, and what Lily does with patient data

**Plain-language answers for a privacy officer, a security reviewer, or anyone filling in a vendor questionnaire** about a
health service built with Lily Design System™. Each answer names the check or contract that makes it true, so it can be
verified rather than trusted. Lily is a user-interface library: it renders what your application gives it, in the browser
(or in Blazor, on your server). It is not a medical device, and it is certified by no one.

The model for this page is openehr-rust's `PHI.md` ([spec/lessons/openehr-rust](spec/lessons/openehr-rust/index.md)). The safety rules behind these answers have
permanent ids, each traced to the tests that check it, in [spec/healthcare-ui/requirements.md](spec/healthcare-ui/requirements.md).

## The short answers

| Question                                               | Answer                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Does Lily send data anywhere?                          | **No.** No headless component or helper package makes a network request (no `fetch`, `XMLHttpRequest`, `sendBeacon`, WebSocket or `EventSource` in shipped code). The `theme-picker` loads the stylesheet URLs **you** give it.                                                                                                                                                                               |
| Does it phone home, or collect telemetry or analytics? | **No.** There is no such code, in the packages, the example apps or the docs site.                                                                                                                                                                                                                                                                                                                            |
| Does it embed or call an AI model?                     | **No.** AI helped write it ([AI_STATEMENT.md](AI_STATEMENT.md)); none runs in it.                                                                                                                                                                                                                                                                                                                             |
| Does it store patient data?                            | **No.** Nothing a user types or a record holds is written to `localStorage`, `sessionStorage`, IndexedDB or a cookie. The preference pickers store a preference (a theme, a text size) only when you turn persistence on; the data grid stores column widths, order, visibility and sort, never rows, only when you set `storageKey`.                                                                         |
| Does it put patient data in error messages?            | **The clinical formatters do not.** Their messages are constants: no number, date, unit, comparator or kind, in TypeScript, C#, Swift and Kotlin (HC-F8 in the [register](spec/healthcare-ui/requirements.md); sentinel tests cover the paths that take text in TypeScript and several in C#). An invalid locale is refused by the platform's own error. Errors from your code and other libraries are yours. |
| Does it put patient data in attributes?                | **Yes, some, and they must be masked too.** See [Patient data in attributes](#patient-data-in-attributes). The national identifier **views** are the exception: they put the identifier in text only (`bin/check-identifier-views`, in `bin/test`).                                                                                                                                                           |
| Do browsers keep what is typed into identifiers?       | **Lily asks them not to.** Every national identifier input sets `autocomplete="off"` and `spellcheck="false"` (`bin/check-identifier-inputs`, in `bin/test`). That is the part Lily can verify: a browser, a password manager or an extension may ignore either.                                                                                                                                              |
| Does it log anything?                                  | Development warnings only (`console.warn`, a missing accessible name), naming the component and the prop, never a value.                                                                                                                                                                                                                                                                                      |
| Does it decide anything clinical?                      | **No.** It computes no score, interpretation, reference range or dose, and converts no unit ([docs/patterns/healthcare](docs/patterns/healthcare/index.md)). A value is shown as given: a partial date is never completed, a result's reported precision is never dropped.                                                                                                                                    |
| Is it HIPAA, GDPR or medical-device compliant?         | **Not by itself, and it claims nothing.** A UI library cannot make a service compliant; it should never be the reason a service cannot be.                                                                                                                                                                                                                                                                    |

## Patient data in attributes

A session-replay or analytics tool that masks text may still record attributes. **Configure it to mask or drop them** on any
page that shows a record. Corrected 2026-11-24: this page used to answer "No".

- **Clinical and date components** carry part of the record in attributes, because they are the page's semantics or the state a
  theme styles: `datetime` (a date of birth, an onset), `data-duration` (an age), `data-interpretation`, `data-severity`, a
  `<meter>`'s value, an email address or telephone number in a link. The whole list for the components made for health records
  is [phi-attributes.tsv](phi-attributes.tsv), and `bin/check-phi-attributes` (in `bin/test`) fails when one is missing. It reads
  the Svelte source, which the other catalogs follow; it does not see attributes you pass through yourself.
- **Form inputs.** A value you give an input may be in its `value` attribute, as in any HTML page, and always is when a server
  renders it: render identifier inputs empty, or mask them. The Web Components identifier inputs are the exception: they keep
  what they hold in no attribute, and still submit and reset (HC-I3).
- **Web Components** that take a value as an attribute keep it on the element, except the identifier views and inputs,
  `age-view`, `duration-view` and `date-time-view`, which remove it once read. Until the script runs, what you wrote in the markup
  is there: set the property instead where the component has one.
- **Angular:** bind a value (`[value]`). A static attribute on the host stays in the page.

## What you must still do

Lily cannot see these, so they are yours:

- **Your own logging and error tracking.** Lily keeps values out of its own errors; your code, your error tracker and your
  session-replay tool can still capture page text, form values and URLs. Mask them there.
- **URLs.** A patient identifier in a page URL reaches browser history, server logs and anything the user shares. The
  `share-picker` shares the page URL, so leave it off pages whose URL names a patient, or give it a URL that does not.
- **Printing, screenshots and the clipboard.** The data grid's export and the `share-picker`'s copy put what is on screen where
  the user chooses.
- **Authentication, authorisation, consent, audit and retention.** Lily has none of them.
- **Your clinical safety case.** The healthcare components follow published safety rules, but whether a screen is safe is your
  clinical safety review's decision.

## Development data

No patient data is anywhere in this repository: not in demos, fixtures, tests or vectors. Demo records are invented, and the
national identifiers in tests are synthetic: worked examples from each algorithm's own documentation, or numbers built to
pass or fail a check digit.

## Reporting

Report a security or privacy problem as [SECURITY.md](SECURITY.md) says. **Never send real patient data** in a report, an
issue or a screenshot.

---

Lily™ and Lily Design System™ are trademarks.
