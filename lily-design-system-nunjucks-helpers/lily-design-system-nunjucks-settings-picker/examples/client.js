import { autoInit } from "@lilydesignsystem/nunjucks-settings-picker";

// Wire every rendered settings picker. `closeOnSelect` (default true) closes the panel when a link,
// button or [role="menuitem"] inside it is activated; opt one element out with a
// data-settings-picker-keep-open ancestor.
autoInit({
  onOpenChange: (open) => console.log("open:", open),
});
