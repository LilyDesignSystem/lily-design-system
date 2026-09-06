import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TuaisceartEireannHealthAndCareNumberInput from './TuaisceartEireannHealthAndCareNumberInput';

const meta = {
  title: 'Examples/TuaisceartEireannHealthAndCareNumberInput',
  component: TuaisceartEireannHealthAndCareNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof TuaisceartEireannHealthAndCareNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
