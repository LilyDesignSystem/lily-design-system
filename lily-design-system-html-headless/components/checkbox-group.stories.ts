import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="checkbox-group"
  role="group"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/CheckboxGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
