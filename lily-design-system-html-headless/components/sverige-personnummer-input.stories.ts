import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="sverige-personnummer-input"
  type="text"
  aria-label="Personal Identity Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/SverigePersonnummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
