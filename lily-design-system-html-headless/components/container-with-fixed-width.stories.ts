import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="container-with-fixed-width"
  data-max-width="1200px"
  style="max-width: 1200px; margin-inline: auto;"
>
  <!-- Consumer provides centered content -->
</div>`;

const meta = {
  title: 'Headless/ContainerWithFixedWidth',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
