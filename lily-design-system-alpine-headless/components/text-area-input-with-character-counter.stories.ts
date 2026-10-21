import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"text-area-input-with-character-counter\" x-data=\"lilyCountedTextarea(20)\">\n  <textarea class=\"text-area-input-with-character-counter-textarea\" aria-label=\"\" aria-describedby=\"text-area-input-with-character-counter-count-1\" x-bind=\"textarea\"></textarea>\n  <span class=\"text-area-input-with-character-counter-count\" id=\"text-area-input-with-character-counter-count-1\" aria-label=\"\" x-bind=\"counter\"></span>\n</div>";

const meta = {
  title: 'Headless/Text Area Input With Character Counter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
