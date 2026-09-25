import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="turkiye-tc-kimlik-numarasi-input"
  type="text"
  aria-label="T.C. Kimlik Numarası"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/TurkiyeTcKimlikNumarasiInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
