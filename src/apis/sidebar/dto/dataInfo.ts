export type dataType = 'shape' | 'structure' | 'sample' | 'images';

// 1. 요청 쿼리 파라미터 인터페이스
export interface DataInfoQueryParams {
  file: string;
  type: dataType;
  n?: number;
}

// 2. 응답 유형별 DTO 인터페이스
export interface ShapeDto {
  rows: number;
  cols: number;
}

export interface ColumnDto {
  name: string;
  dtype: string;
}

export interface StructureDto {
  columns: ColumnDto[];
}

export interface SampleDto {
  columns: string[];
  sample: any[][];
}

export interface ImagesDto {
  images: string[];
}

// 3. 모든 응답을 포괄하는 통합 타입 (선택 사항)
export type DataInfoResponseDto = ShapeDto | StructureDto | SampleDto | ImagesDto;
