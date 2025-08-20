import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import CodeRunIcon from '@/assets/icons/code-run.svg';
import CodeCopyIcon from '@/assets/icons/code-copy.svg';
import CodeDownloadIcon from '@/assets/icons/code-download.svg';

export default function Code({ codeString }: { codeString: string }) {
  return (
    <div className='w-full h-full'>
      <section className='w-full h-15 border-b-2px border-[#C3CCD9] flex items-center justify-start gap-5 pl-5'>
        {CODE_BUTTONS.map((data) => (
          <button onClick={data.onclick} className='p-2 rounded-2xl hover:bg-[#f0f0f0] flex justify-center items-center'>
            <img 
              src={data.icon} 
              alt={data.alt} 
              key={data.alt} 
            />
          </button>
        ))}
      </section>
      <section className='w-full h-full text-[12px] bg-[#272a36]'>
        <SyntaxHighlighter language="python" style={dracula}>
          {codeString}
        </SyntaxHighlighter>
      </section>
    </div>
  );
}

const CODE_BUTTONS = [
  { icon: CodeRunIcon, alt: "Run", onclick: () => {} },
  { icon: CodeCopyIcon, alt: "Copy", onclick: () => {} },
  { icon: CodeDownloadIcon, alt: "Download", onclick: () => {} }
]