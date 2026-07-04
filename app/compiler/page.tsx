export default function CompilerPage() {
  return (
    <div className="page-shell bg-black">
      <iframe src="/compiler/index.html" className="h-[calc(100vh-5rem)] w-full border-0" title="CoreSelva RISC-V Compiler" />
    </div>
  );
}
