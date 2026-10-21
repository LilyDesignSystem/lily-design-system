import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SplitView component -->\n<!--\n  Description: a two-panel resizable layout container with a draggable divider\n               between them\n\n  HTML tag: <div>\n  CSS class: split-view\n  Keyboard: Tab to focus the divider; consumers may wire arrow keys to resize.\n  Accessibility: The container exposes aria-label and data-orientation. The\n                 divider has role=\"separator\", aria-orientation, aria-valuenow,\n                 aria-valuemin, aria-valuemax, and tabindex=\"0\".\n\n  Usage:\n    <div class=\"split-view\" aria-label=\"Editor and preview\"\n         data-orientation=\"horizontal\" data-split-percent=\"50\">\n      <section class=\"split-view-primary\">… primary content …</section>\n      <div class=\"split-view-divider\"\n           role=\"separator\"\n           aria-orientation=\"horizontal\"\n           aria-valuenow=\"50\"\n           aria-valuemin=\"0\"\n           aria-valuemax=\"100\"\n           tabindex=\"0\"></div>\n      <section class=\"split-view-secondary\">… secondary content …</section>\n    </div>\n-->\n\n<div\n  class=\"split-view\"\n  aria-label=\"\"\n  data-orientation=\"horizontal\"\n  data-split-percent=\"50\"\n>\n  <section class=\"split-view-primary\">\n    <!-- Consumer provides primary panel content -->\n  </section>\n\n  <div\n    class=\"split-view-divider\"\n    role=\"separator\"\n    aria-orientation=\"horizontal\"\n    aria-valuenow=\"50\"\n    aria-valuemin=\"0\"\n    aria-valuemax=\"100\"\n    tabindex=\"0\"\n  ></div>\n\n  <section class=\"split-view-secondary\">\n    <!-- Consumer provides secondary panel content -->\n  </section>\n</div>";

const meta = {
  title: 'Headless/Split View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
