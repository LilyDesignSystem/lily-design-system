import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"portugal-numero-de-identificacao-fiscal-input\"\n  type=\"text\"\n  aria-label=\"Tax Identification Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Portugal Numero De Identificacao Fiscal Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
