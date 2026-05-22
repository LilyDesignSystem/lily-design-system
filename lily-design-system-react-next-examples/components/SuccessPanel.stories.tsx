import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SuccessPanel from './SuccessPanel';

const meta = {
  title: 'Examples/SuccessPanel',
  component: SuccessPanel,
  tags: ['autodocs']
} satisfies Meta<typeof SuccessPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
