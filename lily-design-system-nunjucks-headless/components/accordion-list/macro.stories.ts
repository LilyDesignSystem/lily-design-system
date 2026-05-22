import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="accordion-list"></ol>`;

const meta = {
  title: 'Headless/AccordionList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
