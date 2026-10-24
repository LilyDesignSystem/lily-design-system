import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvertDiv from './ConvertDiv';

const meta = {
  title: 'Headless/ConvertDiv',
  component: ConvertDiv,
  tags: ['autodocs'],
  args: { label: 'Currency converter' },
} satisfies Meta<typeof ConvertDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
