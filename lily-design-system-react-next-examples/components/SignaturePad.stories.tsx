import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SignaturePad from './SignaturePad';

const meta = {
  title: 'Examples/SignaturePad',
  component: SignaturePad,
  tags: ['autodocs']
} satisfies Meta<typeof SignaturePad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
