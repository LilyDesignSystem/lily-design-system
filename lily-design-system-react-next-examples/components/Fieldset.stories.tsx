import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Fieldset from './Fieldset';

const meta = {
  title: 'Examples/Fieldset',
  component: Fieldset,
  tags: ['autodocs']
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
