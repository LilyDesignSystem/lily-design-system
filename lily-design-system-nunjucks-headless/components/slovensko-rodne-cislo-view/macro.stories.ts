import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="slovensko-rodne-cislo-view"
  aria-label="Slovak Personal Number">sample-value</span>`;

const meta = {
  title: 'Headless/SlovenskoRodneCisloView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
