import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SummaryBox from './SummaryBox.vue';

const meta = {
  title: 'Headless/SummaryBox',
  component: SummaryBox,
  tags: ['autodocs']
} satisfies Meta<typeof SummaryBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
