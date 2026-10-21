// Alpine reads `window` at import time, so jsdom must already be active
// (vitest's `environment: "jsdom"` guarantees that).
import { afterEach } from "vitest";

// Empty the page and let Alpine finish tearing the old tree down while jsdom
// is still alive; otherwise its queued cleanup (x-for, observers) runs after
// the environment is gone and throws "document is not defined".
afterEach(async () => {
  document.body.innerHTML = "";
  await new Promise((resolve) => setTimeout(resolve, 0));
});
