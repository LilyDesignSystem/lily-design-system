import type { Meta, StoryObj } from '@storybook/react-vite';
import Fieldset from './Fieldset';

const meta = {
  title: 'Headless/Fieldset',
  component: Fieldset,
  tags: ['autodocs']
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
