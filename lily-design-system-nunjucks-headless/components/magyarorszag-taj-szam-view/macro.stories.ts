import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="magyarorszag-taj-szam-view"
  aria-label="Társadalombiztosítási Azonosító Jel (TAJ)">sample-value</span>`;

const meta = {
  title: 'Headless/MagyarorszagTajSzamView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
