import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"tour\" aria-label=\"\" x-data=\"lilyTour(0)\" x-bind=\"root\">\n  <ol class=\"tour-list\">\n    <li class=\"tour-list-item\" x-bind=\"item(0)\"><!-- Consumer provides step content --></li>\n    <li class=\"tour-list-item\" x-bind=\"item(1)\"><!-- Consumer provides step content --></li>\n    <li class=\"tour-list-item\" x-bind=\"item(2)\"><!-- Consumer provides step content --></li>\n  </ol>\n  <button class=\"tour-previous\" aria-label=\"\" x-bind=\"previous\"><!-- Consumer provides label --></button>\n  <button class=\"tour-next\" aria-label=\"\" x-bind=\"next\"><!-- Consumer provides label --></button>\n  <button class=\"tour-close\" aria-label=\"\" x-bind=\"close\"><!-- Consumer provides label --></button>\n</div>";

const meta = {
  title: 'Headless/Tour',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
