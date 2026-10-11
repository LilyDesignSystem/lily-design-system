import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Sheet from './Sheet.vue';

const meta = {
  title: 'Headless/Sheet',
  component: Sheet,
  tags: ['autodocs']
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
