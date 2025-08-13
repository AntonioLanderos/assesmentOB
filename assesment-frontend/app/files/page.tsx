'use client';
import { api } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

type FileRow = { id:number; objectKey:string; mime:string|null; sizeBytes:number|null; createdAt:string };

function IconUpload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden className="inline-block" {...props}>
      <path fill="currentColor" d="M12 3l4 4h-3v5h-2V7H8l4-4zm-7 14h14v2H5v-2z"/>
    </svg>
  );
}
function IconDownload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden className="inline-block" {...props}>
      <path fill="currentColor" d="M13 5h-2v6H8l4 4 4-4h-3V5zM5 19h14v2H5z"/>
    </svg>
  );
}
function Spinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" className="animate-spin" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.2"/>
      <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4"/>
    </svg>
  );
}

export default function FilesPage() {
  const [list, setList] = useState<FileRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string| null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const data = await api<{files: FileRow[]}>('/files/mine');
      setList(data.files);
    } catch (e:any) { setErr(e.message); }
  }
  useEffect(()=>{ load(); },[]);

  function chooseFile() {
    fileRef.current?.click();
  }

  async function upload() {
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      const { id, url } = await api<{id:number; url:string; key:string}>('/files/presign-upload', {
        method: 'POST',
        body: JSON.stringify({ filename: file.name, mime: file.type || 'application/pdf' })
      });
      const put = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/pdf' },
        body: file
      });
      if (!put.ok) throw new Error(`S3 PUT failed ${put.status}`);
      await load();
      setFile(null);
    } catch (e:any) { setErr(e.message); }
    finally { setBusy(false); }
  }

  async function download(id:number) {
    try {
      const { url } = await api<{url:string}>(`/files/${id}/presign-download`, { method: 'POST' });
      window.open(url, '_blank');
    } catch (e:any) { alert(e.message); }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>Subir archivo</CardHeader>
        <CardBody className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e=>setFile(e.target.files?.[0] || null)}
            />
            <Button
              variant="ghost"
              onClick={chooseFile}
              className="gap-2"
            >
              <IconUpload className="h-4 w-4" />
              {file ? 'Cambiar PDF' : 'Elegir PDF'}
            </Button>

            {file ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
                {file.name}
                <button
                  type="button"
                  onClick={()=>setFile(null)}
                  className="text-slate-500 hover:text-slate-900"
                  title="Quitar archivo"
                >
                  ×
                </button>
              </span>
            ) : (
              <span className="text-sm text-slate-500">Solo PDF, máx. ~20 MB</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              disabled={!file || busy}
              onClick={upload}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            >
              {busy ? (<><Spinner className="h-4 w-4" /> Subiendo…</>) : 'Subir'}
            </Button>
            <Button
              variant="ghost"
              disabled={!file || busy}
              onClick={()=>setFile(null)}
            >
              Cancelar
            </Button>
          </div>

          {err && <div className="text-sm text-red-600">{err}</div>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Mis archivos</CardHeader>
        <CardBody>
          {list.length === 0 && <p className="text-sm text-slate-500">No hay archivos.</p>}
          <ul className="divide-y">
            {list.map(f=>(
              <li key={f.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{f.objectKey}</div>
                  <div className="text-xs text-slate-500">
                    {f.mime || '—'} • {new Date(f.createdAt).toLocaleString()}
                  </div>
                </div>
                <Button variant="ghost" className="gap-2" onClick={()=>download(f.id)}>
                  <IconDownload className="h-4 w-4" />
                  Descargar
                </Button>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
