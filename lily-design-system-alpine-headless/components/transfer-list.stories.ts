import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"transfer-list\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Source list region: REQUIRED. -->\n  <section class=\"transfer-list-source\" aria-label=\"\">\n    <!-- Consumer provides the source list (typically a listbox) -->\n  </section>\n\n  <!-- Actions region: optional. Holds move-right / move-left buttons. -->\n  <div class=\"transfer-list-actions\">\n    <!-- Consumer provides the action buttons (or remove this div if unused) -->\n  </div>\n\n  <!-- Target list region: REQUIRED. -->\n  <section class=\"transfer-list-target\" aria-label=\"\">\n    <!-- Consumer provides the target list (typically a listbox) -->\n  </section>\n</div>";

const meta = {
  title: 'Headless/Transfer List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
