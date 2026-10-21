import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"hover-card\" role=\"group\" aria-label=\"\" x-data=\"lilyHoverCard()\" x-bind=\"root\">\n  <a class=\"hover-card-trigger\" href=\"\"><!-- Consumer provides trigger --></a>\n  <div class=\"hover-card-content\" x-bind=\"card\"><!-- Consumer provides content --></div>\n</div>";

const meta = {
  title: 'Headless/Hover Card',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
