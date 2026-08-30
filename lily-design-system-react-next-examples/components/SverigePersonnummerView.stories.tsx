import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SverigePersonnummerView from './SverigePersonnummerView';

const meta = {
  title: 'Examples/SverigePersonnummerView',
  component: SverigePersonnummerView,
  tags: ['autodocs']
} satisfies Meta<typeof SverigePersonnummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SverigePersonnummerView' }
};
