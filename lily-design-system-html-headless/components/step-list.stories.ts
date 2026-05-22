import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="step-list"
  aria-label=""
  data-current=""
>
  <!-- Consumer provides one or more <li class="step-list-item"> children -->
</ol>`;

const meta = {
  title: 'Headless/StepList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
