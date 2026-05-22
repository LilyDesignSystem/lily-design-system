import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<textarea
  class="text-area-input"
  aria-label=""
>
</textarea>`;

const meta = {
  title: 'Headless/TextAreaInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
