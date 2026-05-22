import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div class="accordion-list" role="group" aria-label="">
    <!-- Consumer provides accordion list items -->
</div>`;

const meta = {
  title: 'Headless/AccordionList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
