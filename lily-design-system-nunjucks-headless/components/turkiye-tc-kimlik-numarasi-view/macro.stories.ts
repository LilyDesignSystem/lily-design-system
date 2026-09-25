import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="turkiye-tc-kimlik-numarasi-view"
  aria-label="T.C. Kimlik Numarası">sample-value</span>`;

const meta = {
  title: 'Headless/TurkiyeTcKimlikNumarasiView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
