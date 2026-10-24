import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ConvertFromDiv from './ConvertFromDiv.vue';

const meta = {
  title: 'Headless/ConvertFromDiv',
  component: ConvertFromDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertFromDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
