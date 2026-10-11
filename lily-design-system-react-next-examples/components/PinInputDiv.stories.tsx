import type { Meta, StoryObj } from '@storybook/react-vite';
import PinInputDiv from './PinInputDiv';

const meta = {
  title: 'Headless/PinInputDiv',
  component: PinInputDiv,
  tags: ['autodocs']
} satisfies Meta<typeof PinInputDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
