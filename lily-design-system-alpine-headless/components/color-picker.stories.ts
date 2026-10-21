import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"color-picker\" aria-label=\"\" x-data=\"lilyColorPicker(0, 0)\" x-bind=\"area\">\n  <!-- Consumer provides the colour area and cursor -->\n</div>";

const meta = {
  title: 'Headless/Color Picker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
