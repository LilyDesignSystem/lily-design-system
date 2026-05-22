import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="table"></table>`;

const meta = {
  title: 'Headless/Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
