import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<button\n  class=\"switch-button\"\n  x-data=\"lilySwitchButton(false)\"\n  x-bind=\"button\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Switch Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
