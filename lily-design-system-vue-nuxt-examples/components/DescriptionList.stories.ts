import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DescriptionList from './DescriptionList.vue';

const meta = {
  title: 'Headless/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs']
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
