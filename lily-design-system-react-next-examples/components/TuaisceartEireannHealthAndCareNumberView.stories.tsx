import type { Meta, StoryObj } from '@storybook/react-vite';
import TuaisceartEireannHealthAndCareNumberView from './TuaisceartEireannHealthAndCareNumberView';

const meta = {
  title: 'Headless/TuaisceartEireannHealthAndCareNumberView',
  component: TuaisceartEireannHealthAndCareNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof TuaisceartEireannHealthAndCareNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
