import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AiLabel component -->\n<!--\n  Description: an indicator of AI instances that is a pathway to AI explainability\n  HTML tag: <span>\n  CSS class: ai-label\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"ai-label\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"ai-label\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Ai Label',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
