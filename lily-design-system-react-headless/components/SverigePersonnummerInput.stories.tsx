import type { Meta, StoryObj } from '@storybook/react-vite';
import SverigePersonnummerInput from './SverigePersonnummerInput';

const meta = {
  title: 'Headless/SverigePersonnummerInput',
  component: SverigePersonnummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof SverigePersonnummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SverigePersonnummerInput' }
};
