import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="hrvatska-osobni-identifikacijski-broj-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Personal Identification Number">`;

const meta = {
  title: 'Headless/HrvatskaOsobniIdentifikacijskiBrojInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
