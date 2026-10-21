import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"menu-bar\" role=\"menubar\" aria-label=\"\" x-data=\"lilyMenu('horizontal')\" x-bind=\"menu\">\n  <button class=\"menu-bar-item\" x-bind=\"item('one')\"><!-- Consumer provides label --></button>\n  <button class=\"menu-bar-item\" x-bind=\"item('two')\"><!-- Consumer provides label --></button>\n  <button class=\"menu-bar-item\" x-bind=\"item('three')\"><!-- Consumer provides label --></button>\n</div>";

const meta = {
  title: 'Headless/Menu Bar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
