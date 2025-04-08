# Testes do Backend

Este diretório contém os testes automatizados para o backend da aplicação, utilizando Jest como framework de testes.

## Estrutura dos Testes

Os testes estão organizados da seguinte forma:

- `candidate.test.ts`: Testes de integração para a API de candidatos
- `candidateController.test.ts`: Testes unitários para o controller de candidatos
- `utils/`: Utilitários para os testes
  - `testHelpers.ts`: Funções e mocks reutilizáveis
- `setup.ts`: Configuração global para os testes

## Executando os Testes

Para executar todos os testes:

```bash
npm test
```

Para executar os testes com detecção de vazamentos de recursos:

```bash
npm test -- --detectOpenHandles
```

Para executar um arquivo de teste específico:

```bash
npm test -- src/__tests__/candidate.test.ts
```

Para executar os testes em modo de observação (watch mode):

```bash
npm test -- --watch
```

## Boas Práticas

1. **Estrutura AAA**: Os testes seguem a estrutura Arrange-Act-Assert, organizando o código em três seções distintas.

2. **Mocks**: Utilize os mocks disponíveis em `utils/testHelpers.ts` para simular dependências externas.

3. **Isolamento**: Garanta que cada teste seja isolado e não dependa do resultado de outros testes.

4. **Limpeza**: Use `beforeEach` e `afterEach` para configurar e limpar o ambiente de teste.

5. **Nomeação**: Nomeie os testes de forma descritiva utilizando o padrão "deve fazer algo".

## Troubleshooting

Se os testes estiverem falhando com o erro "worker process has failed to exit gracefully", verifique:

1. Se todos os mocks estão sendo limpos corretamente
2. Se as conexões ao banco de dados estão sendo fechadas
3. Se há timers ou listeners de eventos que não estão sendo cancelados

Você pode usar o flag `--detectOpenHandles` para identificar quais recursos não estão sendo liberados corretamente:

```bash
npm test -- --detectOpenHandles
``` 