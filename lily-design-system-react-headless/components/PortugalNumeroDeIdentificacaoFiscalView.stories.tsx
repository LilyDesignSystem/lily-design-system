import type { Meta, StoryObj } from '@storybook/react-vite';
import PortugalNumeroDeIdentificacaoFiscalView from './PortugalNumeroDeIdentificacaoFiscalView';

const meta = {
  title: 'Headless/PortugalNumeroDeIdentificacaoFiscalView',
  component: PortugalNumeroDeIdentificacaoFiscalView,
  tags: ['autodocs']
} satisfies Meta<typeof PortugalNumeroDeIdentificacaoFiscalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PortugalNumeroDeIdentificacaoFiscalView' }
};
