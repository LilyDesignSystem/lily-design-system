import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ConvertDiv from './ConvertDiv.vue';

const meta = {
  title: 'Headless/ConvertDiv',
  component: ConvertDiv,
  tags: ['autodocs'],
  args: { label: 'Currency converter' },
} satisfies Meta<typeof ConvertDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
