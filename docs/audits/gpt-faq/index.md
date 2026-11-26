# Lily Design System™ FAQ

Start with **[one component you can try offline](#can-i-try-one-component-without-installing-anything)**. If you already have a project, jump to [building and styling](#building-and-styling), [languages and accessibility](#languages-accessibility-and-reuse), or [updates and help](#updates-and-help).

## Getting started

### What is Lily, and who can use it?

Lily™ gives you reusable interface parts such as labelled fields, navigation and dialogs. Each component describes the HTML it renders, how people operate it and how you can style it. You can use the general components in a shop, public service or internal tool. There are also specialist components for healthcare and national identifiers. To see whether Lily fits your project, open a component you already use and try its demo with your keyboard. [Browse the component catalog](https://lilydesignsystem.com/components/)

### Can I try one component without installing anything?

Yes. Save the following as `try-lily.html`, open it in a browser, and press Tab then Enter. The answer opens. Press Enter again to close it. This is Lily’s disclosure pattern using the browser’s built-in behaviour. It also works offline.

```html
<!doctype html>
<html lang="en">
  <meta charset="utf-8" />
  <title>Try a Lily disclosure</title>
  <details class="details">
    <summary>When can I collect my order?</summary>
    <p>Weekdays between 9 am and 5 pm.</p>
  </details>
</html>
```

For a form or a set of related controls, copy a recipe. Check the component’s keyboard guidance before copying an interactive example. A native disclosure works by itself, while a widget such as a combobox also needs code for its interactions. [Details component](../../../components/details/index.md) · [Copyable recipes](https://lilydesignsystem.com/recipes/)

### Which package do I install for my framework?

Choose the framework your application already uses. JavaScript packages have names such as `@lilydesignsystem/react-headless` and `@lilydesignsystem/vue-headless`. Blazor uses `LilyDesignSystem.Blazor.Headless` on NuGet. The framework comparison lists the package, supported framework versions, helper coverage and exceptions for each stack. For example, a Web Component cannot take the place of a native table row. [Framework comparison](../../framework-comparison.md) · [Getting started by framework](https://lilydesignsystem.com/getting-started/)

For an existing React app, these commands show the published requirements, then install the components and optional reference themes at exact versions.

```sh
npm view @lilydesignsystem/react-headless version engines peerDependencies
npm install --save-exact @lilydesignsystem/react-headless @lilydesignsystem/themes
```

Import the named components you use from the package. The React quick start shows a labelled email field, a submit button and their imports together. The Node version used to build an app and the React version it runs are separate requirements. [React quick start](https://lilydesignsystem.com/getting-started/#react)

### Can I adopt Lily on one page and keep the rest of my app?

Yes. Start with a task small enough to check end to end, such as entering an email address and correcting an error. Keep your routing, data handling and existing CSS. Style the Lily class hooks you use, or try a reference theme on an isolated example page first. A full theme also sets page-level values. If you are migrating from Bootstrap, the mapping shows which controls can be carried over and which need different markup or behaviour. [Form validation pattern](../../patterns/form-validation/index.md) · [Bootstrap migration guide](../../../MIGRATING-FROM-BOOTSTRAP.md)

### Can I use Lily for an iPhone or Android app?

Yes. Look up the component in the mobile catalog before adding a dependency. Each entry maps the web pattern to a native SwiftUI or Jetpack Compose control, a Lily component, a composition, or a web-only feature. For example, a designer handing over a screen can use this table to agree with the developer on which control the phone will actually present. [Mobile component map](../../../mobile/index.md)

## Building and styling

### Why does my component look like plain HTML? Can I use Tailwind or my own brand?

That is the expected first render. “Headless” means Lily supplies the element, accessible semantics and documented keyboard behaviour. Your stylesheet supplies the appearance. In a bundled app with the themes package installed, add `import "@lilydesignsystem/themes/light.css";` to the app’s entry point. In plain HTML, copy the stylesheet to your site and link to the URL where you serve it. [Light stylesheet](../../../themes/light.css) · [Theming tutorial](https://lilydesignsystem.com/tutorials/theming/)

Your existing CSS or Tailwind utilities can style the same elements. If a theme appears to do nothing, inspect one element. A Lily button should render with the `button` class. Check that the stylesheet loaded and use the browser’s computed styles to see which rule won. When changing brand colours, test the text, background and keyboard focus together. [Theme specification](../../../spec/theme/index.md) · [Theme contrast results](../../theme-contrast.md)

### Where can I find a complete example? When do I need a helper?

Use a **component** to add one control, a **recipe** to assemble a few controls, and a **worked example** to see a whole page in use. For instance, the form recipe shows how to connect fields, hints and errors. A **helper** packages a larger interaction such as a data grid or a theme picker. Choose a helper when you want its documented behaviour, and supply its labels and configuration. [Complete form recipe](../../../recipes/form/complete-form.html) · [Example applications](https://lilydesignsystem.com/examples/) · [Helper guide](../../../spec/helpers/index.md)

### My React input renders, but why can’t I edit its value?

If you pass a fixed `value`, every render restores it. Keep the value in state and update it when the user types. Lily’s React `EmailInput` passes the new string to `onChange`, so use `value={email} onChange={setEmail}`. Give the input a visible label associated with its ID. Other frameworks use their own binding conventions. [React field example](https://lilydesignsystem.com/getting-started/#react) · [EmailInput source](../../../lily-design-system-react-headless/components/EmailInput.tsx)

### Why does clicking my Save button leave the form open?

Lily’s Button defaults to `type="button"`. For a submit action, set `type="submit"` inside the form and connect the form’s submit handler to your application. Close the dialog or show success after the application accepts the save. If the save fails, keep the entered values and show what the person can do next. [Button contract](../../../components/button/index.md) · [Form validation pattern](../../patterns/form-validation/index.md)

### Is there a Figma kit for designers?

Lily publishes design tokens and live component examples. There is currently no maintained Lily Figma component library or plugin. Start with a running example to see focus, errors and long labels. For the visual design, choose a theme’s token file. The Figma guide describes a possible Tokens Studio import and records that this design-tool workflow still needs hands-on verification. [Lily and Figma](https://lilydesignsystem.com/lily-figma/) · [Light theme tokens](../../../themes/tokens/light.json)

### Will importing Lily add the whole catalog to my page?

With the React headless package, import components by name so your production bundler can remove unused exports. Load only the theme you use. National identifier components have a separate add-on. Other packages have different loading behaviour, particularly custom elements that register on import. Compare the compressed production output before and after adding one real component. The installed package size alone cannot tell you what a visitor downloads. [Optimization guide](https://lilydesignsystem.com/optimize/) · [Package comparison](../../framework-comparison.md)

## Languages, accessibility and reuse

### Who translates the labels? How do I support a right-to-left language?

Your app supplies the words users see and hear, including an icon button’s accessible name and messages after an action. Set the page’s `lang` and `dir` for the language being displayed. Use a helper label pack where one exists, format dates and numbers for the user’s locale, and set the appropriate time zone separately. Most supplied non-English helper translations are machine drafts. Have a fluent reader try a complete task, including the messages spoken by their screen reader. [Label packs](../../../spec/label-packs/index.md) · [Internationalization guide](../../../spec/internationalization/index.md)

### Does using Lily make my service accessible?

Lily targets WCAG 2.2 AAA and publishes a self-assessment, component keyboard contracts and automated test results. Accessibility of your service also depends on the labels, colours, layout and interactions you deliver. Try a complete task with a keyboard, at high zoom and with a screen reader. For a form, deliberately submit an invalid value and check that you can find the error, correct it and continue. The matrix shows where someone has actually recorded assistive-technology results. [Accessibility statement](../../accessibility-statement.md) · [Screen-reader matrix](../../screen-reader-matrix.md) · [Form validation](../../patterns/form-validation/index.md)

### Can I use the healthcare components with patient records?

Lily can display data your application supplies, including results, medicines and record provenance. Use synthetic records to try the examples. Your service handles record access, persistence, clinical decisions and the assurance of the finished workflow. A healthcare-themed screen alone establishes none of these. [Healthcare patterns](../../patterns/healthcare/index.md) · [Privacy answers](../../../PHI.md)

### Can I use Lily in a commercial product or use a government-inspired theme?

Yes, commercial use is available. Choose one of the offered licences, such as MIT, and follow its terms, including the applicable notices. You can describe your product as built with Lily. Use your own product name and identity. A reference theme grants no right to a government crest, logo or restricted typeface, and does not imply endorsement. [MIT terms](../../../LICENSES/mit/index.md) · [Project licences and trademarks](../../../LICENSE.md) · [Visual identity guidance](../../../spec/visual-identity/index.md)

## Updates and help

### My install reports an unsupported Node version. What should I check?

Run `node --version` in the terminal or build job that failed. Then run `npm view @lilydesignsystem/react-headless engines peerDependencies`, substituting the exact package and version you want. The React headless manifest in this checkout requires Node 26 or later. Check React and React DOM against the peer requirements separately. To try markup while sorting out the build, use the offline example above. [Install requirements](../../../INSTALL.md) · [React package manifest](../../../lily-design-system-react-headless/package.json)

### How do I get fixes if I copied the markup or changed a component?

For copied code, record the source file and the version or commit you copied. When a relevant fix ships, compare the change with your copy, keep your intentional changes and retest the interaction. For an installed package, pin the version, review its changelog and upgrade deliberately. Headless libraries and helpers have independent versions. Under Lily’s pre-1.0 support policy, fixes go to the newest patch of the current minor line for that package, and minor upgrades may change its contract. [Support policy](../../../MAINTAINERS.md#support-policy) · [Release guidance](../../releasing.md)

### Where do I ask a question, report a bug or suggest a component?

Open a project issue. Include your framework, package version, the smallest example that shows the problem, what you expected and what happened. For a keyboard or screen-reader issue, include the keys you pressed and what you heard. Designers and translators can contribute wording and task observations without writing code. [Project issues](https://github.com/LilyDesignSystem/lily-design-system/issues) · [Screen-reader report form](https://github.com/LilyDesignSystem/lily-design-system/issues/new?template=screen-reader-report.yml) · [Contribution guide](../../../CONTRIBUTING.md)

---

## Research and editorial assessment

**Updated 26 November 2026 against Lily commit `5c5cd7d4d`.** This edition revisits the archived FAQ and Phase 53 decisions. The questions above are phrased for Lily. The evidence below distinguishes questions people actually posted, questions maintainers chose for their FAQs, and onboarding decisions illustrated by public design systems. The sample identifies recurring needs. It does not measure how frequently Lily users encounter them.

### What users asked about component frameworks

| Evidence                                                                                                                                                                                                                                                                                                                                 | Newcomer need                                                                                                   | Decision for this FAQ                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| A shadcn/ui user wanted upstream fixes without overwriting edited components. [User discussion #7170](https://github.com/shadcn-ui/ui/discussions/7170)                                                                                                                                                                                  | A copy-and-paste quick start leaves ownership of future fixes unclear.                                          | Explain both upgrade paths and what to record on the day the code is copied.                                          |
| One Radix user asked for a dashboard example. Another asked how to submit a dialog form and close it after the operation completed. [Dashboard discussion](https://github.com/radix-ui/primitives/discussions/2033) · [Dialog form discussion](https://github.com/radix-ui/primitives/discussions/399)                                   | A working control leaves questions about the surrounding page and who updates state.                            | Link directly to a composed recipe. Use a concrete input example to explain the application’s part in updating state. |
| Material UI’s FAQ addresses an existing styling solution and colours that differ from the demo. Ant Design’s FAQ covers theme overrides, unchanged controlled values, date localization and breaking changes. [Material UI FAQ](https://mui.com/material-ui/getting-started/faq/) · [Ant Design FAQ](https://ant.design/docs/react/faq/) | Styling conflicts, input ownership and language configuration recur even in frameworks with different defaults. | Lead with the expected first render and one diagnostic the reader can perform. Use Lily’s API in the answer.          |

### What worldwide design systems teach about onboarding

| Source and setting              | Evidence that informed the page                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| United States and Canada        | USWDS describes gradual adoption and checking accessibility in the implemented service. Canada introduces its reusable Web Components and design tokens together. These support answering “Can I start small?” and “Which part do I need?” before listing packages. [USWDS maturity model](https://designsystem.digital.gov/maturity-model/) · [GC Design System introduction](https://design-system.canada.ca/en/start-to-use/)                                                                                                                                                                     |
| Brazil and the United Kingdom   | Brazil explains how shared patterns create a recognizable federal service. GOV.UK documents how to use its frontend outside that visual identity. Together they show why a licence answer also needs to address what the finished product may look like it represents. [Padrão de Governo Digital](https://www.gov.br/governodigital/pt-br/estrategias-e-governanca-digital/transformacao-digital/ferramentas/design-system/design-system/) · [GOV.UK branding guidance](https://frontend.design-system.service.gov.uk/using-govuk-frontend-without-govuk-branding/)                                 |
| Japan, Singapore and Australia  | Japan’s Digital Agency distinguishes terms for guidance, Figma assets and code snippets. Singapore connects design tokens to implementation. New South Wales pairs its Figma kit with behaviour and accessibility guidance. A designer arriving with those expectations needs a direct answer about what Lily provides. [Japan Digital Agency usage notes](https://design.digital.go.jp/dads/introduction/notices/) · [Singapore Government Design System](https://www.designsystem.tech.gov.sg/get-started/) · [NSW designer guide](https://designsystem.nsw.gov.au/get-started/for-designers.html) |
| African public-service projects | The independent afrigov toolkit demonstrates a plain-CSS entry point, country-specific packs and incremental adoption for teams serving people on slow connections. This supports a first example that works offline and a separate answer about download cost. [afrigov project overview](https://afrigov.dev/index.html)                                                                                                                                                                                                                                                                           |

### What to change in Lily’s onboarding

1. **Fix the remaining conflicting install guidance.** The English Help FAQ now explains how to check npm, and the install guide and React manifest agree on Node 26. The troubleshooting answer on the same English Help page still recommends Node 22+, and its opening install section emphasizes vendoring. Align both with the package requirements. Phase 53 also records that the translated registry answers still need updating. Give each translation the same command and check that following either Help entry reaches a supported setup. [English Help](../../../lilydesignsystem.github.io/src/lib/pages/help/en.html) · [Package requirements](../../../lily-design-system-react-headless/package.json) · [Phase 53 status](../../../tasks.md)
2. **Give the FAQ one home in the reader’s journey.** Use the questions above as the public page and keep this research with the audit. Link the page from Getting Started and Help. Preserve the existing Help FAQ fragment for old links. Keep the deeper framework instructions, theme catalog and support policy in their current guides. Use visible question headings with direct links so a reader can search, share or print one answer. [Getting Started source](../../../lilydesignsystem.github.io/src/lib/pages/getting-started/en.html) · [Help source](../../../lilydesignsystem.github.io/src/routes/help/+page.svelte)
3. **Keep changing facts in one place.** The commercial-use wording in the root licence has been corrected. Link to it. The install guide still opens with a 608-component figure while the project specification describes a 661-component catalog with national identifiers packaged separately. A newcomer needs to know which package contains their control. Link to that package from the catalog and test the import in a clean example when packages change. [Licence](../../../LICENSE.md) · [Install guide](../../../INSTALL.md) · [Framework comparison](../../framework-comparison.md)
4. **Validate the order with first-time users.** Ask a developer to open the offline example, a second developer to style one component in an existing app, and a designer to locate a usable theme token. Give them the page without coaching. Record where each starts, whether they finish, and the first unanswered question in their own words. Use those observations and recurring support questions to revise the ordering. A successful first visit ends in a working component or an informed design decision. [Existing newcomer tutorial validation criterion](../../../spec/tutorials/index.md#acceptance-criteria)

---

Lily™ and Lily Design System™ are trademarks.
