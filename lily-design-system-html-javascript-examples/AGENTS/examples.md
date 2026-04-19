## Web app examples design principles rules

All components are styled.

- Examples provide all CSS
- Examples provide all user-facing text via parameters (i18n-ready)
- Examples may provide CSS classes beyond the base class name + consumer CssClass
- Examples provide visual styling, stylesheets, inline styles, colors, sizes, spacing, visual treatment

The subproject must have web routes:

- a web URL route '/' that shows a home page welcome that explains the project
- a web URL route '/components' that goes to a web page that lists each component and links to each component
- a web URL route for each component '/components/{component}' that goes to a web page that demonstrates one component (not many components)
