import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="container-with-fluid-width"
  data-padding-inline="1rem"
  style="width: 100%; padding-inline: 1rem;"></div>`;

const meta = {
  title: 'Headless/ContainerWithFluidWidth',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
