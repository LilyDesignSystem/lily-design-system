import type { Meta, StoryObj } from '@storybook/react-vite';
import TextAreaInputWithCharacterCounter from './TextAreaInputWithCharacterCounter';

const meta = {
  title: 'Headless/TextAreaInputWithCharacterCounter',
  component: TextAreaInputWithCharacterCounter,
  tags: ['autodocs']
} satisfies Meta<typeof TextAreaInputWithCharacterCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
