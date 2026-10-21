import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"expander\" x-data=\"lilyCollapsible(false)\" x-bind=\"root\" role=\"group\" aria-label=\"\">\n  <button data-trigger x-bind=\"trigger\" aria-controls=\"expander-content-1\"><!-- Consumer provides trigger label --></button>\n  <div data-content id=\"expander-content-1\" x-bind=\"content\"><!-- Consumer provides content --></div>\n</div>";

const meta = {
  title: 'Headless/Expander',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
