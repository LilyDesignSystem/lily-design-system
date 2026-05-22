import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="text-area-input-with-character-counter"
  data-module="text-area-input-with-character-counter">
  <textarea
    class="text-area-input-with-character-counter-textarea"
    id="text-area-input-with-character-counter-textarea"
    rows="5"  ></textarea></div>`;

const meta = {
  title: 'Headless/TextAreaInputWithCharacterCounter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
