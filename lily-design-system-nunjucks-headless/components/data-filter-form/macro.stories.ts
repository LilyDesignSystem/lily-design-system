import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<form
  class="data-filter-form"
  action="#"
  method="get"
  role="search"></form>`;

const meta = {
  title: 'Headless/DataFilterForm',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
