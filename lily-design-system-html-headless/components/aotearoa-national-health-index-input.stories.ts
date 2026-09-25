import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="aotearoa-national-health-index-input"
  type="text"
  aria-label="National Health Index (NHI) Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/AotearoaNationalHealthIndexInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
