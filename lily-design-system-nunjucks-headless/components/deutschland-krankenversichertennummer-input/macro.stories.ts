import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="deutschland-krankenversichertennummer-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Health Insurance Number">`;

const meta = {
  title: 'Headless/DeutschlandKrankenversichertennummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
