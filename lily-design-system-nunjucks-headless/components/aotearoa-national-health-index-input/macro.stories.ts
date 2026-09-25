import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="aotearoa-national-health-index-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="New Zealand's National Health Index (NHI) Number">`;

const meta = {
  title: 'Headless/AotearoaNationalHealthIndexInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
