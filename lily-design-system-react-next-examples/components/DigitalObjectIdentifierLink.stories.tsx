import type { Meta, StoryObj } from '@storybook/react-vite';
import DigitalObjectIdentifierLink from './DigitalObjectIdentifierLink';

const meta = {
  title: 'Headless/DigitalObjectIdentifierLink',
  component: DigitalObjectIdentifierLink,
  tags: ['autodocs']
} satisfies Meta<typeof DigitalObjectIdentifierLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
