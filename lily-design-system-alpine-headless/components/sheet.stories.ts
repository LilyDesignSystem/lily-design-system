import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilyOverlay(false)\">\n  <button class=\"sheet-trigger\" x-bind=\"trigger\" aria-controls=\"sheet-1\"><!-- Consumer provides trigger label --></button>\n  <div class=\"sheet\" id=\"sheet-1\" role=\"dialog\" aria-modal=\"true\" aria-label=\"\" tabindex=\"-1\" data-side=\"bottom\" x-bind=\"surface\">\n    <!-- Consumer provides content -->\n    <button class=\"sheet-close\" x-bind=\"closer\"><!-- Consumer provides close label --></button>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Sheet',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
