import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"text-input-with-search\" role=\"search\" aria-label=\"\" x-data=\"lilySearch()\">\n  <input class=\"text-input-with-search-input\" aria-label=\"\" x-bind=\"input\">\n  <button class=\"text-input-with-search-button\" aria-label=\"\" x-bind=\"button\"><!-- Consumer provides icon or text --></button>\n</div>";

const meta = {
  title: 'Headless/Text Input With Search',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
