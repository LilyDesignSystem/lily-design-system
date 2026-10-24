import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="convert-into-div"
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/ConvertIntoDiv',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
