import React, { useState, useRef } from 'react';
import { AttendanceRecord } from '../types';
import SignaturePad, { SignaturePadRef } from './SignaturePad';
import { SaveIcon, ClearIcon } from './icons';

interface AttendanceFormProps {
  onSave: (record: Omit<AttendanceRecord, 'id' | 'courseName'>) => void;
  disabled: boolean;
}

const InputField: React.FC<{ id: string; label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label, type = 'text', value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      required
    />
  </div>
);

const AttendanceForm: React.FC<AttendanceFormProps> = ({ onSave, disabled }) => {
  const getInitialState = () => ({
    trainingDate: new Date().toISOString().split('T')[0],
    participantName: '',
    participantPosition: '',
    participantEmpresa: '',
  });

  const [formData, setFormData] = useState(getInitialState());
  const [error, setError] = useState('');
  const signaturePadRef = useRef<SignaturePadRef>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData(getInitialState());
    signaturePadRef.current?.clear();
    setError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signature = signaturePadRef.current?.getSignature();

    if (signaturePadRef.current?.isEmpty || !signature) {
      setError('La firma del participante es obligatoria.');
      return;
    }
    
    setError('');
    onSave({ ...formData, signature });
    handleClear();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg relative">
      {disabled && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-10 rounded-xl cursor-not-allowed">
          <p className="text-lg text-gray-300 font-medium text-center p-4">
            Primero ingrese el nombre de la capacitación.
          </p>
        </div>
      )}
      <h2 className="text-2xl font-bold text-white mb-6">Nuevo Registro de Asistente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={disabled}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InputField id="participantName" label="Nombre del Participante" value={formData.participantName} onChange={handleChange} />
            </div>
            <InputField id="participantPosition" label="Cargo" value={formData.participantPosition} onChange={handleChange} />
            <InputField id="participantEmpresa" label="Empresa" value={formData.participantEmpresa} onChange={handleChange} />
             <div className="md:col-span-2">
                <InputField id="trainingDate" label="Fecha de Capacitación" type="date" value={formData.trainingDate} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Firma del Participante</label>
            <SignaturePad ref={signaturePadRef} />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition duration-200"
            >
              <ClearIcon />
              Limpiar
            </button>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition duration-200"
            >
              <SaveIcon />
              Guardar
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AttendanceForm;