import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FranceNumeroDIdentificationAuRepertoireView from './FranceNumeroDIdentificationAuRepertoireView';

const meta = {
  title: 'Examples/FranceNumeroDIdentificationAuRepertoireView',
  component: FranceNumeroDIdentificationAuRepertoireView,
  tags: ['autodocs']
} satisfies Meta<typeof FranceNumeroDIdentificationAuRepertoireView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
