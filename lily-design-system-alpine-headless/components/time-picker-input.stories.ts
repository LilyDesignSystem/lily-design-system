import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input class=\"time-picker-input\" type=\"time\" aria-label=\"\" x-data=\"{ value: '' }\" x-model=\"value\" :data-value=\"value\">";

const meta = {
  title: 'Headless/Time Picker Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
