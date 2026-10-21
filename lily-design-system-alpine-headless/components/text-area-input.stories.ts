import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TextAreaInput component -->\n<!--\n  Description: a multi-line text input area\n  HTML tag: <textarea>\n  CSS class: text-area-input\n  Accessibility: aria-label for accessible name\n-->\n\n<textarea\n  class=\"text-area-input\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</textarea>";

const meta = {
  title: 'Headless/Text Area Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
