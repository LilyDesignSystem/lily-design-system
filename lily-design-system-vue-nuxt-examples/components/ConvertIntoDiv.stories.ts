import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ConvertIntoDiv from './ConvertIntoDiv.vue';

const meta = {
  title: 'Headless/ConvertIntoDiv',
  component: ConvertIntoDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertIntoDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
