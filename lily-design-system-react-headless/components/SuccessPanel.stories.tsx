import type { Meta, StoryObj } from '@storybook/react-vite';
import SuccessPanel from './SuccessPanel';

const meta = {
  title: 'Headless/SuccessPanel',
  component: SuccessPanel,
  tags: ['autodocs']
} satisfies Meta<typeof SuccessPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
