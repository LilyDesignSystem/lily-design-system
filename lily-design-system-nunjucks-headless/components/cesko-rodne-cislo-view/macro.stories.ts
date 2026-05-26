import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="cesko-rodne-cislo-view"
  aria-label="Czech Personal Number">sample-value</span>`;

const meta = {
  title: 'Headless/CeskoRodneCisloView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
