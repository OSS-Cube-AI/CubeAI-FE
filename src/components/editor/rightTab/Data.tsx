// Data.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ShapeDto, StructureDto, SampleDto } from '@/apis/sidebar/dto/dataInfo';

interface DataProps {
  data: ShapeDto | StructureDto | SampleDto | null;
  type: 'shape' | 'structure' | 'sample' | 'images';
}

export default function Data({ data, type }: DataProps) {
  if (!data) {
    return <div>데이터를 불러오는 중...</div>;
  }

  // 데이터 타입에 따라 다른 표를 렌더링
  switch (type) {
    case 'shape':
      const shapeData = data as ShapeDto;
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>항목</TableHead>
              <TableHead>값</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>행 (Rows)</TableCell>
              <TableCell>{shapeData.rows}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>열 (Cols)</TableCell>
              <TableCell>{shapeData.cols}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

    case 'structure':
      const structureData = data as StructureDto;
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>컬럼명</TableHead>
              <TableHead>데이터 타입</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {structureData.columns.map((column, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{column.name}</TableCell>
                <TableCell>{column.dtype}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );

    case 'sample':
      const sampleData = data as SampleDto;
      return (
        <Table>
          <TableHeader>
            <TableRow>
              {sampleData.columns.map((column, index) => (
                <TableHead key={index}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.sample.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{String(cell)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );

    // images 타입은 표가 아닌 이미지 갤러리로 보여주는 것이 더 적합하므로
    // 여기서는 따로 처리하지 않음
    default:
      return <div>지원하지 않는 데이터 유형입니다.</div>;
  }
}
