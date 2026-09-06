import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TuaisceartEireannHealthAndCareNumberView from './TuaisceartEireannHealthAndCareNumberView';

const meta = {
  title: 'Examples/TuaisceartEireannHealthAndCareNumberView',
  component: TuaisceartEireannHealthAndCareNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof TuaisceartEireannHealthAndCareNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
