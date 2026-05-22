import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SectionList from './SectionList.vue';

const meta = {
  title: 'Headless/SectionList',
  component: SectionList,
  tags: ['autodocs']
} satisfies Meta<typeof SectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
