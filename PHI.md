# PHI, privacy, and what Lily does with patient data

**Plain-language answers for a privacy officer, a security reviewer, or anyone filling in a vendor questionnaire** about a
health service built with Lily Design System™. Each answer names the check or contract that makes it true, so it can be
verified rather than trusted. Lily is a user-interface library: it renders what your application gives it, in the browser
(or in Blazor, on your server). It is not a medical device, and it is certified by no one.

The model for this page is openehr-rust's `PHI.md` ([spec/lessons/openehr-rust](spec/lessons/openehr-rust/index.md)). The safety rules behind these answers have
permanent ids, each traced to the tests that check it, in [spec/healthcare-ui/requirements.md](spec/healthcare-ui/requirements.md).

## The short answers

| Question                                               | Answer                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Does Lily send data anywhere?                          | **No.** No headless component or helper package makes a network request (no `fetch`, `XMLHttpRequest`, `sendBeacon`, WebSocket or `EventSource` in shipped code). The `theme-picker` loads the stylesheet URLs **you** give it.                                                                                                                                                      |
| Does it phone home, or collect telemetry or analytics? | **No.** There is no such code, in the packages, the example apps or the docs site.                                                                                                                                                                                                                                                                                                   |
| Does it embed or call an AI model?                     | **No.** AI helped write it ([AI_STATEMENT.md](AI_STATEMENT.md)); none runs in it.                                                                                                                                                                                                                                                                                                    |
| Does it store patient data?                            | **No.** Nothing a user types or a record holds is written to `localStorage`, `sessionStorage`, IndexedDB or a cookie. The preference pickers store a preference (a theme, a text size) only when you turn persistence on; the data grid stores column widths, order, visibility and sort, never rows, only when you set `storageKey`.                                                |
| Does it put patient data in error messages?            | **No.** The clinical formatters' errors name the rule broken, never the value, in TypeScript, C#, Swift and Kotlin; a test passes a sentinel value and fails if it appears ([spec/lessons/openehr-rust](spec/lessons/openehr-rust/index.md), item 1).                                                                                                                                |
| Does it put patient data in attributes?                | **No.** The national identifier views put the identifier in text only, never in an attribute, which a session-replay tool might record unmasked; a Web Components view removes the `value` attribute it was given once it has read it (`bin/check-identifier-views`, in `bin/test`). In Angular, bind the value (`[value]`), since a static attribute on the host stays in the page. |
| Do browsers keep what is typed into identifiers?       | **No.** Every national identifier input sets `autocomplete="off"` and `spellcheck="false"`, so the browser neither saves the value nor sends it to a cloud spellchecker (`bin/check-identifier-inputs`, in `bin/test`).                                                                                                                                                              |
| Does it log anything?                                  | Development warnings only (`console.warn`, a missing accessible name), naming the component and the prop, never a value.                                                                                                                                                                                                                                                             |
| Does it decide anything clinical?                      | **No.** It computes no score, interpretation, reference range or dose, and converts no unit ([docs/patterns/healthcare](docs/patterns/healthcare/index.md)). A value is shown as given: a partial date is never completed, a result's reported precision is never dropped.                                                                                                           |
| Is it HIPAA, GDPR or medical-device compliant?         | **Not by itself, and it claims nothing.** A UI library cannot make a service compliant; it should never be the reason a service cannot be.                                                                                                                                                                                                                                           |

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
