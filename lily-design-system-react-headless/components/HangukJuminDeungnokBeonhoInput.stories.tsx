import type { Meta, StoryObj } from '@storybook/react-vite';
import HangukJuminDeungnokBeonhoInput from './HangukJuminDeungnokBeonhoInput';

const meta = {
  title: 'Headless/HangukJuminDeungnokBeonhoInput',
  component: HangukJuminDeungnokBeonhoInput,
  tags: ['autodocs']
} satisfies Meta<typeof HangukJuminDeungnokBeonhoInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'HangukJuminDeungnokBeonhoInput' }
};
