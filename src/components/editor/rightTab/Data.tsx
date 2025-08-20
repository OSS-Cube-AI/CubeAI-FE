import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ShapeDto, SampleDto, ImagesDto } from '@/apis/sidebar/dto/dataInfo';
import { useDataInfo } from '@/apis/sidebar/quries/useDataInfoQuery';

const FILE_TYPE_LIST = ['mnist_train.csv', 'mnist_test.csv'];

export default function Data() {
  const [file, setFile] = useState<(typeof FILE_TYPE_LIST)[number]>(FILE_TYPE_LIST[0]);

  const { data: shapeData } = useDataInfo({ file, type: 'shape' });
  // const { data: structureData } = useDataInfo({ file, type: 'structure' });
  const { data: sampleData } = useDataInfo({ file, type: 'sample', n: 10 });
  const { data: imagesData } = useDataInfo({ file, type: 'images', n: 9 });

  return (
    <div className="p-2">
      <select
        value={file}
        onChange={e => setFile(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        {FILE_TYPE_LIST.map(f => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <Accordion type="multiple" defaultValue={['shape']} className="w-full">
        <AccordionItem value="shape">
          <AccordionTrigger>Data Shape</AccordionTrigger>
          <AccordionContent>
            <ShapeInfo data={shapeData as ShapeDto} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sample">
          <AccordionTrigger>Data Sample (10개)</AccordionTrigger>
          <AccordionContent>
            <SampleInfo data={sampleData as SampleDto} />
          </AccordionContent>
        </AccordionItem>
        {/* <AccordionItem value="structure">
          <AccordionTrigger>Data Structure</AccordionTrigger>
          <AccordionContent>
            <StructureInfo data={structureData as StructureDto} />
          </AccordionContent>
        </AccordionItem> */}
        <AccordionItem value="images">
          <AccordionTrigger>Image Sample (9개)</AccordionTrigger>
          <AccordionContent>
            <ImagesInfo data={imagesData as ImagesDto} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ShapeInfo({ data }: { data?: ShapeDto }) {
  if (!data) return <div>데이터를 불러오는 중...</div>;
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
          <TableCell>{data.rows}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>열 (Cols)</TableCell>
          <TableCell>{data.cols}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

// 얘는 일단 안씀
//
// function StructureInfo({ data }: { data?: StructureDto }) {
//   if (!data) return <div>데이터를 불러오는 중...</div>;
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>컬럼명</TableHead>
//           <TableHead>데이터 타입</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {data.columns.map((column, index) => (
//           <TableRow key={index}>
//             <TableCell className="font-medium">{column.name}</TableCell>
//             <TableCell>{column.dtype}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

function SampleInfo({ data }: { data?: SampleDto }) {
  if (!data) return <div>데이터를 불러오는 중...</div>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {data.columns.map((column, index) => (
            <TableHead key={index}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.sample.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{String(cell)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ImagesInfo({ data }: { data?: ImagesDto }) {
  if (!data) return <div>데이터를 불러오는 중...</div>;

  return (
    <div className="grid grid-cols-3 gap-4 p-2">
      {data.images.map((image, index) => (
        <div key={index} className="flex flex-col items-center border rounded-md p-2">
          <img
            // base64 데이터를 이미지로 표시하는 부분
            src={`data:image/png;base64,${image}`}
            alt={`Sample label: ${index + 1}`}
            className="w-full h-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
}
