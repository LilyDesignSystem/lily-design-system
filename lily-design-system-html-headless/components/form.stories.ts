import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<form
  class="form"
  aria-label=""
>
  <!-- Consumer provides form fields -->
</form>`;

const meta = {
  title: 'Headless/Form',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
