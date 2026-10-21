import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Label component -->\n<!--\n  Description: a label associated with a form input\n  HTML tag: <label>\n  CSS class: label\n  Accessibility: aria-label for accessible name\n-->\n\n<label\n  class=\"label\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</label>";

const meta = {
  title: 'Headless/Label',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
