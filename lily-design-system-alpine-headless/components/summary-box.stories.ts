import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SummaryBox component -->\n<!--\n  Description: a boxed callout highlighting key takeaways or next steps from a longer page\n\n  HTML tag: <aside>\n  CSS class: summary-box\n  Keyboard: None (passive container; inner focusable elements behave normally)\n  Accessibility:\n    - <aside> provides a complementary landmark\n    - aria-label gives the region an accessible name (defaults to the heading text)\n\n  Usage:\n    <aside class=\"summary-box\" aria-label=\"Key takeaways\">\n      <h3 class=\"summary-box-heading\">Key takeaways</h3>\n      <div class=\"summary-box-body\">\n        <ul>…</ul>\n      </div>\n    </aside>\n-->\n\n<aside\n  class=\"summary-box\"\n  aria-label=\"\"\n>\n  <h3 class=\"summary-box-heading\">\n    <!-- Consumer-provided heading text -->\n  </h3>\n  <div class=\"summary-box-body\">\n    <!-- Consumer-provided body content -->\n  </div>\n</aside>";

const meta = {
  title: 'Headless/Summary Box',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
