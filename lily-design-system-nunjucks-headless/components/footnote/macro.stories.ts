import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<sup
  class="footnote">
  <a
    href="#"  ></a>
</sup>`;

const meta = {
  title: 'Headless/Footnote',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
