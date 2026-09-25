import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="osterreich-sozialversicherungsnummer-view"
  aria-label="Sozialversicherungsnummer (SVNR)"
>sample-value</span>`;

const meta = {
  title: 'Headless/OsterreichSozialversicherungsnummerView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
