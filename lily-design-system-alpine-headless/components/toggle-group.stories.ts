import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"toggle-group\" role=\"group\" aria-label=\"\" x-data=\"lilyToggleGroup([])\">\n  <button class=\"toggle-group-item\" x-bind=\"item('one')\"><!-- Consumer provides content --></button>\n  <button class=\"toggle-group-item\" x-bind=\"item('two')\"><!-- Consumer provides content --></button>\n</div>";

const meta = {
  title: 'Headless/Toggle Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
