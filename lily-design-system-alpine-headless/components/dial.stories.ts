import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"dial\" aria-label=\"\" x-data=\"lilyDial(50, 0, 100, 1)\" x-bind=\"dial\">\n  <!-- Consumer provides the dial face -->\n</div>";

const meta = {
  title: 'Headless/Dial',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
