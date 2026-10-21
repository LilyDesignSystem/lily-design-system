import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"emoji-character-picker\" role=\"grid\" aria-label=\"\">\n  <!-- Consumer provides grid rows and cells holding the emoji, and any category filtering -->\n</div>";

const meta = {
  title: 'Headless/Emoji Character Picker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
