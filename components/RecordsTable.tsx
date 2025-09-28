import React from 'react';
import { AttendanceRecord } from '../types';
import { ExportIcon } from './icons';

interface RecordsTableProps {
  records: AttendanceRecord[];
  onExport: () => void;
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records, onExport }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8 lg:mt-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Registros Guardados</h2>
        <button
          onClick={onExport}
          disabled={records.length === 0}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <ExportIcon />
          Exportar a PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        {records.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No hay registros aún. Agregue uno usando el formulario.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Curso</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Participante</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Firma</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{record.courseName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{record.participantName}</div>
                    <div className="text-xs text-gray-400">{record.participantPosition} - {record.participantEmpresa}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.trainingDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={record.signature} alt="Signature" className="w-28 h-14 object-contain bg-white rounded-md p-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecordsTable;