import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TabGroup from './TabGroup.vue';

const meta = {
  title: 'Headless/TabGroup',
  component: TabGroup,
  tags: ['autodocs']
} satisfies Meta<typeof TabGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
