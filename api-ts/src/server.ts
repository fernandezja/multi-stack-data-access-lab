import express from 'express';
import cors from 'cors';
import { apiReference } from '@scalar/express-api-reference';
import { readFileSync } from 'node:fs';

import { database } from './infrastructure/database';
import { problem } from './http/problem';
import { toJediDto, toSearchJediDto } from './mappers/JediMapper';
import { createJediSchema, searchJediSchema } from './validation/JediSchemas';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/jedi', async (_request, response) => {
  const jedi = await database.jedi.findMany({
    orderBy: { jediId: 'asc' }
  });

  return response.json(jedi.map(toJediDto));
});

app.get('/jedi/:id', async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return problem(response, 400, 'Invalid jediId');
  }

  const jedi = await database.jedi.findUnique({
    where: { jediId: id }
  });

  return jedi
    ? response.json(toJediDto(jedi))
    : problem(response, 404, 'Jedi not found');
});

app.post('/jedi', async (request, response) => {
  const parsed = createJediSchema.safeParse(request.body);

  if (!parsed.success) {
    return problem(
      response,
      400,
      'Invalid request body',
      parsed.error.flatten().fieldErrors
    );
  }

  const jedi = await database.jedi.create({
    data: parsed.data
  });

  return response
    .location(`/jedi/${jedi.jediId}`)
    .status(201)
    .json(toJediDto(jedi));
});

app.post('/jedi/search', async (request, response) => {
  const parsed = searchJediSchema.safeParse(request.body);

  if (!parsed.success) {
    return problem(
      response,
      400,
      'Invalid request body',
      parsed.error.flatten().fieldErrors
    );
  }

  const { searchTerm, pageIndex, pageSize } = parsed.data;
  const word = (searchTerm ?? '').trim();

  const total = await database.jedi.count({
    where: word ? { name: { contains: word } } : undefined
  });

  const rows: unknown[] = await database.$queryRaw`
    CALL Jedi_Search(${word || null}, ${pageIndex}, ${pageSize})
  `;

  return response.json({
    items: rows.map(toSearchJediDto),
    pageIndex,
    pageSize,
    totalCount: total,
    totalPages: Math.ceil(total / pageSize)
  });
});

app.get('/health', async (_request, response) => {
  try {
    await database.$queryRaw`SELECT 1`;
    await database.$queryRaw`CALL Jedi_Search(NULL, 0, 1)`;

    return response.json({ status: 'ok' });
  } catch {
    return response.status(503).json({ status: 'unavailable' });
  }
});

app.get('/openapi/v1.json', (_request, response) => {
  try {
    const document = readFileSync('dist/swagger.json', 'utf8');
    return response.json(JSON.parse(document));
  } catch {
    return response.status(503).json({
      status: 'unavailable',
      detail: 'OpenAPI no generado. Ejecutá npm run build.'
    });
  }
});

app.use('/scalar', apiReference({ url: '/openapi/v1.json' }));

app.use((_error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) =>
  problem(response, 500, 'Error inesperado'));

app.listen(Number(process.env.PORT ?? 3001), '0.0.0.0');
