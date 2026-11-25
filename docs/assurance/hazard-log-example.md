# A worked hazard log

Three hazards of an assembled clinical screen, worked through, so a clinical safety lead can see where Lily's part ends. It is an
**example to adapt, not a safety case**: no clinician has reviewed it, nothing here scores a likelihood or severity, and every
owner is for your organisation to name. The people and records are invented.

Lily is a component library. In England, NHS guidance separates the manufacturer's clinical risk management from the deploying
organisation's
([clinical risk management standards](https://digital.nhs.uk/services/clinical-safety/clinical-risk-management-standards)), and
shows how a hazard is passed to an adopting team
([an example](https://digital.nhs.uk/services/booking-and-referral-standard/clinical-safety)). Other countries have their own
rules: check yours.

The ids are in the [requirements register](../../spec/healthcare-ui/requirements.md). Its `tested` means a test cites the id; read
the test, and check that it ran against the package version you install.

## 1. An action is taken on the wrong patient

| Part                | Content                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hazardous situation | Two people with similar names are open, and the clinician acts on the one they did not mean.                                                                                                         |
| Lily control        | The patient banner pattern: two identifiers, nothing truncated at 320 pixels, allergies never blank (HC-B1, HC-B2, HC-B3). An age is refused for a partial birth date (HC-F16).                      |
| Host dependency     | The banner is on every screen that acts, is the record the action is sent to, and changes with it. A draft stays with its patient. The service checks the patient again when it receives the action. |
| Evidence            | The banner's browser tests; `/handover` in the SvelteKit examples, where a draft stays with its patient. No session with a clinician has been run.                                                   |
| Residual risk       | A person can read the banner and still act on habit. Limiting how many records are open has not been shown to help (HC-X2).                                                                          |
| Owner               | Named by the deploying organisation                                                                                                                                                                  |

## 2. A withdrawn result is read as current

| Part                | Content                                                                                                                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hazardous situation | A laboratory withdraws a result, and the screen still shows its value or flag as if it stood.                                                                                                                                |
| Lily control        | `observation-view` shows only the words for an `entered-in-error` result, and drops its flag, range and meter (HC-C13); a result with no words for its status shows no value (HC-C14); a masked one leaves no flag (HC-C12). |
| Host dependency     | The status reaches the screen, promptly; the words are translated; `showWithdrawn` is used only in a history view; a restricted value is withheld before it is sent. Who follows up is decided by the service.               |
| Evidence            | The tests the register cites, in eight web runtimes, Swift and Kotlin, transitions included. The spoken order has not been confirmed with a screen-reader user.                                                              |
| Residual risk       | A value already copied, printed or remembered is not recalled. An older package version shows the value: check yours.                                                                                                        |
| Owner               | Named by the deploying organisation                                                                                                                                                                                          |

## 3. A handover is believed delivered when it was not

| Part                | Content                                                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hazardous situation | The screen says a handover was sent; nobody received it, and nobody acts.                                                                                                                                          |
| Lily control        | None over delivery: Lily sends nothing. The example is a labelled rehearsal that cannot submit, and lists the states a delivering service must tell apart.                                                         |
| Host dependency     | Pending, delivered, failed, unknown and accepted are different states with a named destination; the draft is kept until delivery is confirmed; a retry says it may arrive twice; there is a fallback by telephone. |
| Evidence            | `/handover` and its browser tests: nothing is announced as sent, and no field value reaches a URL, with and without its script.                                                                                    |
| Residual risk       | Delivered is not read, and read is not acted on.                                                                                                                                                                   |
| Owner               | Named by the deploying organisation                                                                                                                                                                                |

---

Lily™ and Lily Design System™ are trademarks.
