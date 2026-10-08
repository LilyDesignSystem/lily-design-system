import { autoInit } from "@lilydesignsystem/nunjucks-menu-picker";

// Wire every rendered menu picker. `closeOnSelect` (default true) closes the panel when a link,
// button or [role="menuitem"] inside it is activated; opt one element out with a
// data-menu-picker-keep-open ancestor.
autoInit({
  onOpenChange: (open) => console.log("open:", open),
});
