import React, { useState, useCallback } from 'react';
import { AttendanceRecord } from './types';
import AttendanceForm from './components/AttendanceForm';
import RecordsTable from './components/RecordsTable';

// This tells TypeScript about the global variables from the CDN scripts.
declare global {
  interface Window {
    jspdf: any;
  }
}

const App: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [courseName, setCourseName] = useState('');

  const handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseName(e.target.value);
  };

  const handleSaveRecord = useCallback((newRecordData: Omit<AttendanceRecord, 'id' | 'courseName'>) => {
    if (!courseName) return;
    
    const newRecord: AttendanceRecord = {
      ...newRecordData,
      courseName,
      id: new Date().toISOString() + Math.random(),
    };
    setRecords(prevRecords => [newRecord, ...prevRecords]);
  }, [courseName]);

  const handleExportPDF = useCallback(() => {
    if (records.length === 0) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Registro de Asistencia: ${courseName}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de exportación: ${new Date().toLocaleDateString()}`, 14, 30);


    (doc as any).autoTable({
      startY: 38,
      head: [['#', 'Participante', 'Cargo', 'Empresa', 'Fecha', 'Firma']],
      body: records.map((r, i) => [
        i + 1,
        r.participantName,
        r.participantPosition,
        r.participantEmpresa,
        r.trainingDate,
        '' // Empty cell for signature image
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59], // gray-800
        textColor: [255, 255, 255],
      },
      styles: {
        halign: 'center',
        valign: 'middle'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left' },
        2: { halign: 'left' },
        3: { halign: 'left' },
        4: { halign: 'center' },
        5: { cellWidth: 40, minCellHeight: 20 }, // Signature column
      },
      didDrawCell: (data: any) => {
        if (data.section === 'body' && data.column.index === 5) {
          const record = records[data.row.index];
          if (record?.signature) {
            const base64Img = record.signature;
            const imgWidth = 35;
            const imgHeight = 15;
            const x = data.cell.x + (data.cell.width - imgWidth) / 2;
            const y = data.cell.y + (data.cell.height - imgHeight) / 2;
            doc.addImage(base64Img, 'PNG', x, y, imgWidth, imgHeight);
          }
        }
      },
    });

    const safeCourseName = courseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`registro_asistencia_${safeCourseName}.pdf`);

  }, [records, courseName]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Registro de Asistencia a Capacitaciones</h1>
          <p className="text-gray-400 mt-2">Una solución moderna para registrar y gestionar la asistencia.</p>
        </header>

        <section className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Información de la Capacitación</h2>
          <div>
            <label htmlFor="sessionCourseName" className="block text-sm font-medium text-gray-300 mb-1">Nombre del curso/capacitación</label>
            <input
              type="text"
              id="sessionCourseName"
              name="sessionCourseName"
              value={courseName}
              onChange={handleCourseNameChange}
              placeholder="Escriba el nombre del curso aquí para habilitar el formulario"
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </section>
        
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <AttendanceForm onSave={handleSaveRecord} disabled={!courseName.trim()} />
          </div>
          <div className="lg:col-span-3">
            <RecordsTable records={records} onExport={handleExportPDF} />
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Desarrollado con React y Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;