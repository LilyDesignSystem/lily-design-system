import type { Meta, StoryObj } from '@storybook/react-vite';
import SignaturePad from './SignaturePad';

const meta = {
  title: 'Headless/SignaturePad',
  component: SignaturePad,
  tags: ['autodocs']
} satisfies Meta<typeof SignaturePad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
