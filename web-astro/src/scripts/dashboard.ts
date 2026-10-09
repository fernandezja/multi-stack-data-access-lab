import type { JediDto, Provider } from '../types/jedi';

const root = document.querySelector<HTMLElement>('[data-dashboard]');
const providerSelect = document.querySelector<HTMLSelectElement>('#provider');
const rows = document.querySelector<HTMLTableSectionElement>('#rows');
const status = document.querySelector<HTMLElement>('#status');
const scalarLink = document.querySelector<HTMLAnchorElement>('#scalar');
const openApiLink = document.querySelector<HTMLAnchorElement>('#openapi');

if (root && providerSelect && rows && status && scalarLink && openApiLink) {
  const urls: Record<Provider, string> = {
    ts: root.dataset.apiTs ?? '',
    net: root.dataset.apiNet ?? ''
  };

  const getBaseUrl = (): string => urls[providerSelect.value as Provider];

  const updateLinks = (): void => {
    const baseUrl = getBaseUrl();
    scalarLink.href = `${baseUrl}/scalar`;
    openApiLink.href = `${baseUrl}/openapi/v1.json`;
  };

  const renderRows = (jedi: JediDto[]): void => {
    rows.innerHTML = jedi
      .map(item => `
        <tr>
          <td>${item.jediId}</td>
          <td>${item.name}</td>
          <td>${item.jediTypeId}</td>
        </tr>`)
      .join('');
  };

  const loadJedi = async (): Promise<void> => {
    updateLinks();
    const startedAt = performance.now();

    try {
      const response = await fetch(`${getBaseUrl()}/jedi`);
      const data = (await response.json()) as JediDto[];

      renderRows(data);
      status.textContent = `${response.status} · ${Math.round(performance.now() - startedAt)} ms`;
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Error inesperado';
    }
  };

  providerSelect.addEventListener('change', () => void loadJedi());
  document.querySelector('#load')?.addEventListener('click', () => void loadJedi());
  updateLinks();
}
