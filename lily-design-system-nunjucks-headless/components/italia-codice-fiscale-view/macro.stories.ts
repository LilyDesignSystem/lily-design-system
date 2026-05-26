import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="italia-codice-fiscale-view"
  aria-label="Italian Fiscal Code">sample-value</span>`;

const meta = {
  title: 'Headless/ItaliaCodiceFiscaleView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
