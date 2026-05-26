import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="hrvatska-osobni-identifikacijski-broj-input"
  type="text"
  aria-label="Personal Identification Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/HrvatskaOsobniIdentifikacijskiBrojInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
