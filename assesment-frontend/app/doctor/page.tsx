'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

type SubStatus = 'free' | 'active' | 'past_due' | 'canceled';
type Patient = { patientUserId: number; email: string; status?: SubStatus };
type FileRow = { id: number; objectKey: string; mime: string | null; sizeBytes: number | null; createdAt: string };

function IconUsers(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h10v-2.5C14 14.17 10.33 13 8 13m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"/></svg>);
}
function IconFile(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8zM6 20V4h7v5h5v11z"/></svg>);
}
function IconDownload(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="M13 5h-2v6H8l4 4l4-4h-3V5zM5 19h14v2H5z"/></svg>);
}
function IconWand(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="m17.75 4.09l1.41 1.41l-1.66 1.66l-1.41-1.41zM11 2h2v3h-2zm-6.75 2.09l1.66 1.66L4.5 7.16L3.09 5.75zM2 11h3v2H2zm17.25 7.91l-1.41 1.41l-1.66-1.66l1.41-1.41zM19 11h3v2h-3zM7.5 18.34L5.09 20.75L3.68 19.34l2.41-2.41zM14 8l2 2l-8 8l-2-2z"/></svg>);
}
function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="M6 10V8a6 6 0 1 1 12 0v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm2 0h8V8a4 4 0 1 0-8 0z"/></svg>);
}
function Spinner(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" className="animate-spin" {...props}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.2"/><path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4"/></svg>);
}

export default function DoctorPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selected, setSelected] = useState<Patient | null>(null);

  const [files, setFiles] = useState<FileRow[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const [draft, setDraft] = useState('');
  const [aiBusy, setAiBusy] = useState(false);

  const [note, setNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ patients: Patient[] }>('/doctor/patients');
        setPatients(r.patients || []);
      } finally {
        setLoadingPatients(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      setLoadingFiles(true);
      setFiles([]);
      try {
        const r = await api<{ files: FileRow[] }>(`/doctor/patients/${selected.patientUserId}/files`);
        setFiles(r.files || []);
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoadingFiles(false);
      }
    })();
  }, [selected]);

  const isPremium = selected?.status === 'active';

  async function download(fileId: number) {
    try {
      const { url } = await api<{ url: string }>(`/files/${fileId}/presign-download`, { method: 'POST' });
      window.open(url, '_blank');
    } catch (e: any) {
      alert(e.message || 'No autorizado o archivo no disponible');
    }
  }

  async function generateDraft() {
    if (!selected) return;
    setAiBusy(true);
    setTimeout(() => {
      const when = new Date().toLocaleString();
      setDraft(
        `Borrador de reporte clínico\n\nPaciente: ${selected.email} (id ${selected.patientUserId})\nFecha: ${when}\n\nMotivo de consulta:\n\nHallazgos relevantes:\n\nPlan y recomendaciones:\n\n— Generado como borrador (demo).`
      );
      setAiBusy(false);
    }, 1000);
  }

  async function saveNote() {
    if (!selected || !note.trim()) return;
    setSavingNote(true);
    setTimeout(() => {
      setSavingNote(false);
      setNote('');
      alert('Nota guardada (demo)');
    }, 600);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <IconUsers className="h-5 w-5" />
          Pacientes asignados
        </CardHeader>
        <CardBody>
          {loadingPatients && <p className="text-sm text-slate-500">Cargando…</p>}
          {!loadingPatients && patients.length === 0 && <p className="text-sm text-slate-500">Sin asignaciones.</p>}
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map(p => (
              <li key={p.patientUserId}>
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className={`w-full text-left rounded-md border px-3 py-2 hover:bg-slate-50 ${selected?.patientUserId === p.patientUserId ? 'border-[--color-brand] ring-1 ring-[--color-brand]' : 'border-slate-200'}`}
                >
                  <div className="font-medium truncate">{p.email}</div>
                  <div className="text-xs text-slate-500">id {p.patientUserId} • plan {p.status || '—'}</div>
                </button>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {selected && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex items-center gap-2">
              <IconFile className="h-5 w-5" />
              Archivos clínicos
            </CardHeader>
            <CardBody>
              {loadingFiles && <p className="text-sm text-slate-500">Cargando archivos…</p>}
              {!loadingFiles && files.length === 0 && (
                <p className="text-sm text-slate-500">Sin archivos visibles para este paciente.</p>
              )}
              <ul className="divide-y">
                {files.map(f => (
                  <li key={f.id} className="py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{f.objectKey}</div>
                      <div className="text-xs text-slate-500">
                        {f.mime || '—'} • {new Date(f.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <Button variant="ghost" className="gap-2" onClick={() => download(f.id)}>
                      <IconDownload className="h-4 w-4" />
                      Descargar
                    </Button>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex items-center gap-2">
                <IconWand className="h-5 w-5" />
                Borrador de reporte (IA)
              </CardHeader>
              <CardBody className="grid gap-3">
                <Button
                  className="gap-2"
                  onClick={generateDraft}
                  disabled={!isPremium || aiBusy}
                  title={!isPremium ? 'Requiere paciente Premium' : undefined}
                >
                  {aiBusy ? <Spinner className="h-4 w-4" /> : <IconWand className="h-4 w-4" />}
                  {aiBusy ? 'Generando…' : isPremium ? 'Generar borrador' : 'Premium requerido'}
                </Button>
                <textarea
                  className="input min-h-[160px]"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Aquí aparecerá el borrador de reporte clínico…"
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>Notas de la consulta</CardHeader>
              <CardBody className="grid gap-3">
                <textarea
                  className="input min-h-[120px]"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Escribe notas o comentarios…"
                />
                <div className="flex gap-2">
                  <Button onClick={saveNote} disabled={!note.trim() || savingNote}>
                    {savingNote ? 'Guardando…' : 'Guardar nota'}
                  </Button>
                  <Button variant="ghost" onClick={() => setNote('')} disabled={!note.trim() || savingNote}>
                    Limpiar
                  </Button>
                </div>
              </CardBody>
            </Card>

            {!isPremium && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                Algunas funciones se muestran deshabilitadas porque el paciente no es Premium.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
