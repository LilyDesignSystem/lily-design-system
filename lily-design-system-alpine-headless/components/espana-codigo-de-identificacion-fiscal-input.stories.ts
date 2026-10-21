import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"espana-codigo-de-identificacion-fiscal-input\"\n  type=\"text\"\n  aria-label=\"Tax Identification Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Espana Codigo De Identificacion Fiscal Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
