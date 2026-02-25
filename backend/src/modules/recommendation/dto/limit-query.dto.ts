import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class LimitQueryDto {
  @Transform(({ value }) => (value === undefined ? 16 : Number(value)))
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 16;
}
