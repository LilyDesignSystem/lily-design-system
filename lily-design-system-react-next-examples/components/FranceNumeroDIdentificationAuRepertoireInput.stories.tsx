import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FranceNumeroDIdentificationAuRepertoireInput from './FranceNumeroDIdentificationAuRepertoireInput';

const meta = {
  title: 'Examples/FranceNumeroDIdentificationAuRepertoireInput',
  component: FranceNumeroDIdentificationAuRepertoireInput,
  tags: ['autodocs']
} satisfies Meta<typeof FranceNumeroDIdentificationAuRepertoireInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
