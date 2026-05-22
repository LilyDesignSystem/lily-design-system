import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<output
  class="character-counter"
  aria-live="polite">0 characters</output>`;

const meta = {
  title: 'Headless/CharacterCounter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
