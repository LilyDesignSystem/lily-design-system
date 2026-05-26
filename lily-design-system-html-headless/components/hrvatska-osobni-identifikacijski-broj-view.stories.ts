import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="hrvatska-osobni-identifikacijski-broj-view"
  aria-label="Personal Identification Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/HrvatskaOsobniIdentifikacijskiBrojView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
