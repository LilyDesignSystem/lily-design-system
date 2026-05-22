import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="statistic"
  role="group"
  aria-label=""
>
  <!-- Title: REQUIRED. The text label/heading for the statistic. -->
  <div class="statistic-title">
    <!-- Consumer provides the title text -->
  </div>

  <!-- Value: REQUIRED. The pre-formatted numeric value text. -->
  <div class="statistic-value">
    <!-- Optional prefix (e.g. currency symbol) -->
    <span class="statistic-prefix">
      <!-- Consumer provides the prefix content (or remove this span if unused) -->
    </span>

    <!-- Consumer inserts the value text directly here -->

    <!-- Optional suffix (e.g. unit or percentage sign) -->
    <span class="statistic-suffix">
      <!-- Consumer provides the suffix content (or remove this span if unused) -->
    </span>
  </div>
</div>`;

const meta = {
  title: 'Headless/Statistic',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
