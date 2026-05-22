import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="coachmark"
  role="dialog"
  aria-modal="false"
  aria-labelledby="coachmark-title" hidden>
  <h2 class="coachmark-title" id="coachmark-title"></h2><button class="coachmark-dismiss" type="button" aria-label="">&times;</button>
</div>`;

const meta = {
  title: 'Headless/Coachmark',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
