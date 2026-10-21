import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- HiddenInput component -->\n<!--\n  Description: a hidden input for including data in form submission\n  HTML tag: <input>\n  CSS class: hidden-input\n  Accessibility: aria-label for accessible name\n-->\n\n<input\n  class=\"hidden-input\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</input>";

const meta = {
  title: 'Headless/Hidden Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
