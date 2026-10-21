import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"portugal-numero-de-identificacao-fiscal-view\"\n  aria-label=\"Tax Identification Number\"\n></span>";

const meta = {
  title: 'Headless/Portugal Numero De Identificacao Fiscal View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
