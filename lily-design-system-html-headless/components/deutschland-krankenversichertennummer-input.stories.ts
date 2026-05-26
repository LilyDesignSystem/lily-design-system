import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="deutschland-krankenversichertennummer-input"
  type="text"
  aria-label="Health Insurance Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/DeutschlandKrankenversichertennummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
