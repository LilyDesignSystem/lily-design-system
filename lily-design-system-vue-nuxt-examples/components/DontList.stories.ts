import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DontList from './DontList.vue';

const meta = {
  title: 'Headless/DontList',
  component: DontList,
  tags: ['autodocs']
} satisfies Meta<typeof DontList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
