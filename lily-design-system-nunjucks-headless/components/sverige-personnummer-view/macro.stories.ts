import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="sverige-personnummer-view"
  aria-label="Personal Identity Number">sample-value</span>`;

const meta = {
  title: 'Headless/SverigePersonnummerView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
