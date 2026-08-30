import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DeutschlandKrankenversichertennummerView from './DeutschlandKrankenversichertennummerView';

const meta = {
  title: 'Examples/DeutschlandKrankenversichertennummerView',
  component: DeutschlandKrankenversichertennummerView,
  tags: ['autodocs']
} satisfies Meta<typeof DeutschlandKrankenversichertennummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'DeutschlandKrankenversichertennummerView' }
};
