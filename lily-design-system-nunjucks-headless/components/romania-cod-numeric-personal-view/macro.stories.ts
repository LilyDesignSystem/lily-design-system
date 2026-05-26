import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="romania-cod-numeric-personal-view"
  aria-label="Personal Numerical Code">sample-value</span>`;

const meta = {
  title: 'Headless/RomaniaCodNumericPersonalView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
