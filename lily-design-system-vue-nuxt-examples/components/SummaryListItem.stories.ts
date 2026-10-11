import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SummaryListItem from './SummaryListItem.vue';

const meta = {
  title: 'Headless/SummaryListItem',
  component: SummaryListItem,
  tags: ['autodocs']
} satisfies Meta<typeof SummaryListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
