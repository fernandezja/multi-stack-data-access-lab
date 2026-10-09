import type { JediDto } from '../contracts/Jedi';

export function toJediDto(value: any): JediDto {
  return {
    jediId: value.jediId,
    name: value.name,
    jediTypeId: value.jediTypeId
  };
}

export function toSearchJediDto(value: any): JediDto {
  return {
    jediId: Number(value.JediId),
    name: value.Name,
    jediTypeId: Number(value.JediTypeId)
  };
}
