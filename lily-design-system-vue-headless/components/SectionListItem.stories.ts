import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SectionListItem from './SectionListItem.vue';

const meta = {
  title: 'Headless/SectionListItem',
  component: SectionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof SectionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
