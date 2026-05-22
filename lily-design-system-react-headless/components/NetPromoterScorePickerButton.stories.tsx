import type { Meta, StoryObj } from '@storybook/react-vite';
import NetPromoterScorePickerButton from './NetPromoterScorePickerButton';

const meta = {
  title: 'Headless/NetPromoterScorePickerButton',
  component: NetPromoterScorePickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof NetPromoterScorePickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
