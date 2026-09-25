import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="aotearoa-national-health-index-view"
  aria-label="New Zealand's National Health Index (NHI) Number">Sample value</span>`;

const meta = {
  title: 'Headless/AotearoaNationalHealthIndexView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
