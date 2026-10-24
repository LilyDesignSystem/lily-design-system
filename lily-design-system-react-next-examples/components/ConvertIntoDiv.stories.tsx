import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvertIntoDiv from './ConvertIntoDiv';

const meta = {
  title: 'Headless/ConvertIntoDiv',
  component: ConvertIntoDiv,
  tags: ['autodocs'],
} satisfies Meta<typeof ConvertIntoDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
