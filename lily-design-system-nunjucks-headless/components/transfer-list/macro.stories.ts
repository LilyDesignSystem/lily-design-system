import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="transfer-list"
  role="group">
  <section
    class="transfer-list-source"  ></section>  <section
    class="transfer-list-target"  ></section>
</div>`;

const meta = {
  title: 'Headless/TransferList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
