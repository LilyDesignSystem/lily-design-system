import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="magyarorszag-taj-szam-input"
  type="text"
  aria-label="Társadalombiztosítási Azonosító Jel (TAJ)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/MagyarorszagTajSzamInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
