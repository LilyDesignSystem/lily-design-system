import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DeutschlandKrankenversichertennummerInput from './DeutschlandKrankenversichertennummerInput';

const meta = {
  title: 'Examples/DeutschlandKrankenversichertennummerInput',
  component: DeutschlandKrankenversichertennummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof DeutschlandKrankenversichertennummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'DeutschlandKrankenversichertennummerInput' }
};
