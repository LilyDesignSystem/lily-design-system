import type { Meta, StoryObj } from '@storybook/react-vite';
import SverigePersonnummerView from './SverigePersonnummerView';

const meta = {
  title: 'Headless/SverigePersonnummerView',
  component: SverigePersonnummerView,
  tags: ['autodocs']
} satisfies Meta<typeof SverigePersonnummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SverigePersonnummerView' }
};
