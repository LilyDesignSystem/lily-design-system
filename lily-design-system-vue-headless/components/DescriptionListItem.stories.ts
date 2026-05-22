import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DescriptionListItem from './DescriptionListItem.vue';

const meta = {
  title: 'Headless/DescriptionListItem',
  component: DescriptionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof DescriptionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
