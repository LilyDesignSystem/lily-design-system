import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DialGroup from './DialGroup.vue';

const meta = {
  title: 'Headless/DialGroup',
  component: DialGroup,
  tags: ['autodocs']
} satisfies Meta<typeof DialGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
