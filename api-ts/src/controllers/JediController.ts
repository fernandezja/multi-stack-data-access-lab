import { Body, Controller, Get, Path, Post, Route, Tags } from 'tsoa';

export interface JediDto { jediId: number; name: string; jediTypeId: number; }
export interface CreateJedi { name: string; jediTypeId: 1 | 2 | 3; }
export interface SearchRequest { searchTerm?: string | null; pageIndex?: number; pageSize?: number; }
export interface PagedJedi { items: JediDto[]; pageIndex: number; pageSize: number; totalCount: number; totalPages: number; }

@Route('jedi')
@Tags('Jedi')
export class JediController extends Controller {
  @Get('/')
  public async list(): Promise<JediDto[]> { return []; }

  @Get('{id}')
  public async get(@Path() id: number): Promise<JediDto> { return { jediId: id, name: '', jediTypeId: 1 }; }

  @Post('/')
  public async create(@Body() body: CreateJedi): Promise<JediDto> { return { jediId: 0, ...body }; }

  @Post('search')
  public async search(@Body() body: SearchRequest): Promise<PagedJedi> { return { items: [], pageIndex: body.pageIndex ?? 0, pageSize: body.pageSize ?? 10, totalCount: 0, totalPages: 0 }; }
}

@Route('health')
@Tags('Health')
export class HealthController extends Controller {
  @Get('/')
  public async health(): Promise<{ status: string }> { return { status: 'ok' }; }
}
