import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../client/src/App';

// Mock fetch for API calls
const mockFetch = (data) =>
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });

const mockFetchError = (errorMsg) =>
  global.fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: errorMsg }),
  });

describe('App Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the app header', () => {
    render(<App />);
    expect(screen.getByText('ChemViz')).toBeDefined();
  });

  it('renders search input', () => {
    render(<App />);
    expect(
      screen.getByPlaceholderText(/busca una molécula/i)
    ).toBeDefined();
  });

  it('renders example buttons', () => {
    render(<App />);
    expect(screen.getByText('Aspirin')).toBeDefined();
    expect(screen.getByText('Caffeine')).toBeDefined();
    expect(screen.getByText('Water')).toBeDefined();
  });

  it('shows empty history message', () => {
    render(<App />);
    expect(screen.getByText('Sin búsquedas recientes')).toBeDefined();
  });

  it('performs search on example button click', async () => {
    const mockData = {
      cid: 2244,
      iupacName: '2-acetyloxybenzoic acid',
      commonName: 'aspirin',
      molecularFormula: 'C9H8O4',
      molecularWeight: 180.16,
      smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
      elements: [
        { symbol: 'C', count: 9 },
        { symbol: 'H', count: 8 },
        { symbol: 'O', count: 4 },
      ],
      atoms: [],
      bonds: [],
    };
    mockFetch(mockData);

    render(<App />);
    const aspirinBtn = screen.getByText('Aspirin');
    await userEvent.click(aspirinBtn);

    // After clicking, the molecule info should appear
    expect(await screen.findByText('Aspirin')).toBeDefined();
  });

  it('shows error when molecule not found', async () => {
    mockFetchError('Molecule "unknown" not found.');

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/busca una molécula/i);
    const searchBtn = screen.getByText('Buscar');

    await userEvent.type(searchInput, 'unknown');
    await userEvent.click(searchBtn);

    expect(
      await screen.findByText('Molécula no encontrada')
    ).toBeDefined();
  });
});
