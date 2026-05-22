import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MenuGroup from './MenuGroup.vue';

const meta = {
  title: 'Headless/MenuGroup',
  component: MenuGroup,
  tags: ['autodocs']
} satisfies Meta<typeof MenuGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
