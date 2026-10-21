import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input id=\"character-counter-field-1\" type=\"text\" aria-label=\"\">\n<span class=\"character-counter\" aria-label=\"\" x-data=\"lilyCharacterCounter(20, 'character-counter-field-1')\" x-bind=\"counter\"></span>";

const meta = {
  title: 'Headless/Character Counter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
