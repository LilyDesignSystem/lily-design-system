import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="submit-input"
  type="submit"  value="Submit">`;

const meta = {
  title: 'Headless/SubmitInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
