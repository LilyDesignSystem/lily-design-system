import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<button
  type="button"
  aria-haspopup="dialog"
  aria-controls="popup-1"
  command="toggle-popover"
  commandfor="popup-1"
  popovertarget="popup-1"
>
  <!-- Consumer provides trigger text -->
</button>

<div
  class="popup"
  id="popup-1"
  popover="auto"
  role="dialog"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Popup behavior
  // Opening, closing, Escape and light dismiss are the browser's: popover="auto"
  // and a trigger with command="toggle-popover" commandfor (or popovertarget)
  // need no script. This script only (1) keeps aria-expanded on each trigger in
  // step with the panel's toggle event and (2) where the Popover API is missing
  // (browsers before Chrome 114, Firefox 125, Safari 17) falls back to the
  // hidden attribute, a click toggle and Escape. Pure vanilla JavaScript.
  (function () {
    "use strict";

    var native = typeof HTMLElement.prototype.showPopover === "function";

    document.querySelectorAll("div.popup").forEach(function (panel) {
      if (!panel.id) return;
      var triggers = Array.prototype.slice.call(
        document.querySelectorAll(
          '[commandfor="' + panel.id + '"], [popovertarget="' + panel.id + '"]'
        )
      ).filter(function (t) {
        var command = t.getAttribute("command");
        return !command || command === "toggle-popover";
      });

      function setExpanded(open) {
        triggers.forEach(function (t) {
          t.setAttribute("aria-expanded", open ? "true" : "false");
        });
      }

      if (native) {
        setExpanded(panel.matches(":popover-open"));
        panel.addEventListener("toggle", function (event) {
          setExpanded(event.newState === "open");
        });
        return;
      }

      // Fallback: no Popover API.
      panel.removeAttribute("popover");
      panel.setAttribute("hidden", "");
      setExpanded(false);
      function show(open) {
        if (open) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
        setExpanded(open);
      }
      triggers.forEach(function (t) {
        t.addEventListener("click", function () {
          if (t.disabled) return;
          show(panel.hasAttribute("hidden"));
        });
      });
      panel.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !panel.hasAttribute("hidden")) {
          show(false);
          if (triggers[0]) triggers[0].focus();
        }
      });
    });
  })();
</script>`;

const meta = {
    title: "Headless/Popup",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
