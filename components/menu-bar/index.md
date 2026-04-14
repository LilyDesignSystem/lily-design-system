# Menu Bar

A menu bar is a horizontal menu container using the ARIA menubar role, typically found at the top of an application window. It provides left/right arrow key navigation between top-level menu items, mimicking the behavior of desktop application menu bars (e.g., File, Edit, View). Each top-level item may open a submenu or trigger an action directly.

The component manages horizontal focus movement between menu items, with Home and End keys to jump to the first and last items. The consumer provides menu bar item elements as children and handles submenu display and item activation externally.

## Implementation Notes

- Renders a `<div>` with `role="menubar"` and an accessible label.
- Uses reactive state to track the `barRef` element reference for querying child items.
- Keyboard navigation queries all child elements with `[role='menuitem']` to build the navigable item list.
- Uses ArrowLeft/ArrowRight (horizontal) instead of ArrowUp/ArrowDown (vertical) to match the horizontal orientation.
- Arrow keys wrap around: pressing ArrowRight on the last item moves focus to the first, and vice versa.
- Home and End keys jump to the first and last menu bar item respectively.
- Spreads `restProps` onto the container for consumer customization.
- This is a compound component -- pair with MenuBarItem for individual menu bar entries.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `children`: slot (required) -- menu bar item elements to render (should have `role="menuitem"` and `tabindex="-1"`).
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Usage

Desktop-style application menu bar:

```html
<MenuBar label="Application menu">
    <MenuBarButton onclick={() => openSubmenu('file')}>File</MenuBarButton>
    <MenuBarButton onclick={() => openSubmenu('edit')}>Edit</MenuBarButton>
    <MenuBarButton onclick={() => openSubmenu('view')}>View</MenuBarButton>
    <MenuBarButton onclick={() => openSubmenu('help')}>Help</MenuBarButton>
</MenuBar>
```

Dynamic menu bar from a configuration list:

```html
<MenuBar label="Main menu">
    {#each menuItems as item}
        <MenuBarButton onclick={() => openSubmenu(item)}>
            {item.label}
        </MenuBarButton>
    {/each}
</MenuBar>
```

## Keyboard Interactions

- ArrowRight: Moves focus to the next menu bar item, wrapping to the first item from the last.
- ArrowLeft: Moves focus to the previous menu bar item, wrapping to the last item from the first.
- Home: Moves focus to the first menu bar item.
- End: Moves focus to the last menu bar item.

## ARIA

- `role="menubar"` -- identifies the container as a horizontal menu bar widget.
- `aria-label` -- provides an accessible name describing the purpose of the menu bar.
- Child elements should use `role="menuitem"` with `tabindex="-1"` for focusable menu bar items.

## When to Use

- Use for a horizontal bar of menu triggers, like a desktop application menu bar (File, Edit, View).
- Use when each entry may open a submenu or trigger an action directly.
- Use in desktop-style web applications that mimic native application chrome.
- Use when horizontal left/right arrow key navigation is needed between top-level menu entries.

## When Not to Use

- Do not use for tab-style navigation -- use TabBar instead.
- Do not use for tool actions -- use ToolBar instead.
- Do not use for simple navigation links -- use NavigationMenu instead.

## Headless

This headless component provides the ARIA menubar role with horizontal keyboard navigation (ArrowLeft/ArrowRight with wrapping, Home, End) and focus management for child menuitem elements. The consumer provides all visual styling, including bar layout, item appearance, submenu triggers, and hover states.


## Styles

The consumer provides all CSS styling. The component renders with a `.menu-bar` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `menu-bar`
- Verify role="menubar"` -- identifies the container as a horizontal menu bar widget.
- Verify aria-label` -- provides an accessible name describing the purpose of the menu bar.
- Verify Child elements should use `role="menuitem"` with `tabindex="-1"` for focusable menu bar items.
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Design menu bar items with consistent sizing and spacing, and provide clear visual indicators for items that open submenus (e.g., a downward arrow).
- **Developers**: Use ArrowLeft/ArrowRight for horizontal navigation. Pair with MenuBarItem for individual entries that provide `role="menuitem"` semantics.

## Composition

MenuBar is a compound component that contains MenuBarItem children. MenuBar provides `role="menubar"` with horizontal keyboard navigation, while each MenuBarItem provides `role="menuitem"` semantics.

```
MenuBar (role="menubar") → MenuBarItem (role="menuitem")
```

## References

- WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menubar/
