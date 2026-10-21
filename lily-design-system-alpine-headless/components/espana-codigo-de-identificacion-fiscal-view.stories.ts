import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"espana-codigo-de-identificacion-fiscal-view\"\n  aria-label=\"Tax Identification Code\"\n></span>";

const meta = {
  title: 'Headless/Espana Codigo De Identificacion Fiscal View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
