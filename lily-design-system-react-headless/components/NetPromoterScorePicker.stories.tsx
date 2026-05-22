import type { Meta, StoryObj } from '@storybook/react-vite';
import NetPromoterScorePicker from './NetPromoterScorePicker';

const meta = {
  title: 'Headless/NetPromoterScorePicker',
  component: NetPromoterScorePicker,
  tags: ['autodocs']
} satisfies Meta<typeof NetPromoterScorePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
