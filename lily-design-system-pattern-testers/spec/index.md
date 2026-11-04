# Pattern testers: specification

The published form of the testers in [spec/testing](../../spec/testing/index.md#pattern-testers).

- A contract is data, and every driver runs the same steps.
- A tester reads roles and ARIA from the DOM. Only `picker-listbox` and `picker-disclosure` use a class hook.
- A failure throws an error naming the contract, the hook and the step.
- `pattern-tester.test.ts` proves a conforming widget passes and a broken one fails.
