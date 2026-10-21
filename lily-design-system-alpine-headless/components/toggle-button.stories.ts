import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<button\n  class=\"toggle-button\"\n  x-data=\"lilyToggleButton(false)\"\n  x-bind=\"button\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Toggle Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
