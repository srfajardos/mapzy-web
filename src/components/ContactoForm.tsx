'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Globe,
  Linkedin,
  Instagram,
  Youtube,
  ChevronRight,
  ChevronLeft,
  Loader,
  Database,
  Leaf,
  Zap,
  UploadCloud,
  File,
  Check,
  Building,
  Phone,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface ContactoFormProps {
  formId?: string;
}

type RFQStep = 1 | 2 | 3 | 4;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turnstile?: any;
  }
}

export default function ContactoForm({ formId }: ContactoFormProps) {
  const [step, setStep] = useState<RFQStep>(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isQuickConsult, setIsQuickConsult] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  
  // RFQ States
  const [selectedService, setSelectedService] = useState<string>('');
  const [formData, setFormData] = useState({
    area: '',
    presupuesto: '',
    descripcion: '',
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
  });
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAD-y4UBap3YNZjET';

  const services = [
    {
      id: 'geologia',
      name: 'Geología y Minería',
      description: 'Exploración, reservas y diseño de planes de minería.',
      icon: Database,
    },
    {
      id: 'ambiental',
      name: 'Gestión Ambiental',
      description: 'Estudios de impacto, licencias y manejo ambiental.',
      icon: Leaf,
    },
    {
      id: 'sig',
      name: 'Tecnología SIG',
      description: 'Análisis espacial avanzado y gemelos digitales.',
      icon: Zap,
    },
    {
      id: 'ordenamiento',
      name: 'Ordenamiento Territorial',
      description: 'POT, zonificación de precisión y uso de suelos.',
      icon: Globe,
    },
  ];

  // Cargar Turnstile Script dinámicamente al estar en el paso 4
  useEffect(() => {
    if (step === 4 && siteKey) {
      const scriptId = 'cf-turnstile-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      const timer = setTimeout(() => {
        if (window.turnstile && turnstileContainerRef.current) {
          try {
            turnstileContainerRef.current.innerHTML = '';
            window.turnstile.render(turnstileContainerRef.current, {
              sitekey: siteKey,
              callback: (token: string) => {
                setTurnstileToken(token);
              },
            });
          } catch (e) {
            console.warn('Error renderizando Turnstile:', e);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [step, siteKey]);

  // Handle inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setEmailError('');
    }
  };

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setFileError('');
    if (rejectedFiles && rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setFileError('El archivo excede el límite de 10 MB.');
      } else if (error.code === 'file-invalid-type') {
        setFileError('Tipo de archivo no soportado. Formatos válidos: KMZ, SHP, DWG, DXF.');
      } else {
        setFileError('Error al cargar archivo.');
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    accept: {
      'application/vnd.google-earth.kmz': ['.kmz'],
      'application/x-qgis': ['.shp'],
      'application/acad': ['.dwg', '.dxf'],
      'image/vnd.dwg': ['.dwg'],
      'image/vnd.dxf': ['.dxf'],
      'application/octet-stream': ['.shp', '.dbf', '.shx', '.prj', '.kmz', '.dwg', '.dxf'],
    },
  });

  const removeFile = () => {
    setUploadedFile(null);
    setFileError('');
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  // Navigation validation
  const canGoNext = () => {
    if (step === 1) return selectedService !== '';
    if (step === 2) return formData.descripcion.trim() !== '';
    if (step === 3) return true; // El archivo es opcional
    return false;
  };

  const nextStep = () => {
    if (canGoNext() && step < 4) {
      setStep((prev) => (prev + 1) as RFQStep);
    }
  };

  const prevStep = () => {
    if (step === 4 && isQuickConsult) {
      setStep(1);
      setIsQuickConsult(false);
      setSelectedService('');
      setFormData((prev) => ({ ...prev, descripcion: '' }));
    } else if (step > 1) {
      setStep((prev) => (prev - 1) as RFQStep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError('Ingresa un correo electrónico válido.');
      return;
    }

    setStatus('loading');

    const submissionData = new FormData();
    submissionData.append('Nombre', formData.nombre);
    submissionData.append('Empresa', formData.empresa || 'Consulta General (Persona Natural)');
    submissionData.append('Email', formData.email);
    submissionData.append('Teléfono', formData.telefono);
    submissionData.append('Tipo de Solicitud', isQuickConsult ? 'Consulta Rápida / General' : 'Cotización RFQ');
    submissionData.append('Servicio Requerido', selectedService);
    if (turnstileToken) {
      submissionData.append('cf-turnstile-response', turnstileToken);
    }

    if (isQuickConsult) {
      submissionData.append('Mensaje de Consulta', formData.descripcion);
    } else {
      submissionData.append('Área Estimada', formData.area || 'No especificada');
      submissionData.append('Presupuesto Estimado', formData.presupuesto || 'No especificado');
      submissionData.append('Descripción Técnica', formData.descripcion);
      if (uploadedFile) {
        submissionData.append('Archivo Adjunto', uploadedFile);
        submissionData.append('Metadata Archivo', `${uploadedFile.name} (${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        submissionData.append('Metadata Archivo', 'Ninguno');
      }
    }

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        body: submissionData,
      });

      if (response.ok) {
        setStatus('success');
        setSelectedService('');
        setIsQuickConsult(false);
        setFormData({
          area: '',
          presupuesto: '',
          descripcion: '',
          nombre: '',
          empresa: '',
          email: '',
          telefono: '',
        });
        setUploadedFile(null);
        setTurnstileToken('');
        setStep(1);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud RFQ:', error);
      setStatus('error');
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <section id="contacto" className="py-24 px-4 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-950 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800">
          
          {/* Info Panel */}
          <div className="lg:w-2/5 p-12 lg:p-20 bg-[#1a2a44] text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
              <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-3 inline-block bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                Portal de Ingeniería RFQ
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Cotiza tu <span className="text-yellow-400">Proyecto</span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 font-light">
                Utiliza nuestro configurador de cotización técnica para enviarnos coordenadas, áreas estimadas de intervención o archivos GIS/CAD. O bien realiza una consulta rápida directamente.
              </p>

              {/* Steps Progress Visual Indicator */}
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-xs font-bold tracking-widest uppercase text-gray-400">
                  <span>Progreso</span>
                  <span className="text-yellow-400">
                    {isQuickConsult ? 'Consulta Rápida' : `Paso ${step} de 4`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                    style={{ width: isQuickConsult ? '100%' : `${(step / 4) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-yellow-400 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Correo Operaciones</p>
                    <a href="mailto:contacto@mapzy.com.co" className="font-bold text-sm text-white hover:text-yellow-400 transition-colors">
                      contacto@mapzy.com.co
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-yellow-400 shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Sede Central</p>
                    <p className="font-bold text-sm">Bogotá / Ricaurte, Cundinamarca, Colombia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex gap-4 mt-12">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-[#1a2a44] transition-all hover:scale-115"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-[#1a2a44] transition-all hover:scale-115"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-[#1a2a44] transition-all hover:scale-115"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:w-3/5 p-8 sm:p-12 lg:p-20 bg-slate-950 flex flex-col justify-center min-h-[500px]">
            {status === 'success' ? (
              <div className="text-center p-8 bg-emerald-950/20 border border-emerald-500/20 rounded-3xl animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={36} />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Solicitud Enviada con Éxito</h3>
                <p className="text-slate-400 max-w-sm mx-auto mb-8 font-light text-sm">
                  Hemos registrado tus requerimientos. Nuestro departamento comercial se pondrá en contacto contigo en las próximas 24 horas hábiles.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="bg-yellow-400 text-[#1a2a44] font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-all"
                >
                  Iniciar Nueva Solicitud
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* PASO 1: CATEGORIZACIÓN */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">Selecciona el Sector del Proyecto</h3>
                          <p className="text-gray-400 text-xs mb-6 font-light">Escoge la disciplina que mejor describa la intervención.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {services.map((svc) => {
                            const Icon = svc.icon;
                            const isSelected = selectedService === svc.name && !isQuickConsult;
                            return (
                              <button
                                type="button"
                                key={svc.id}
                                onClick={() => {
                                  setSelectedService(svc.name);
                                  setIsQuickConsult(false);
                                }}
                                className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                                  isSelected
                                    ? 'border-yellow-400 bg-yellow-400/5 shadow-[0_0_20px_rgba(250,204,21,0.1)]'
                                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                                }`}
                              >
                                <div className={`p-3 rounded-xl mb-4 shrink-0 transition-colors ${
                                  isSelected ? 'bg-yellow-400 text-[#1a2a44]' : 'bg-slate-800 text-slate-400 group-hover:text-yellow-400'
                                }`}>
                                  <Icon size={24} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-white mb-1 text-sm sm:text-base">{svc.name}</h4>
                                  <p className="text-slate-400 text-xs font-light leading-relaxed">{svc.description}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Quick Consult Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedService('Consulta General');
                            setIsQuickConsult(true);
                            setStep(4);
                          }}
                          className="w-full mt-6 p-6 rounded-2xl border border-dashed border-slate-850 bg-slate-900/20 text-center hover:border-yellow-400 hover:bg-yellow-400/5 transition-all text-white font-bold group flex items-center justify-center gap-3"
                        >
                          <span>Realizar Consulta Rápida / General</span>
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-yellow-400" />
                        </button>
                      </motion.div>
                    )}

                    {/* PASO 2: DETALLES TÉCNICOS */}
                    {step === 2 && !isQuickConsult && (
                      <motion.div
                        key="step2"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">Alcance y Requerimientos Técnicos</h3>
                          <p className="text-gray-400 text-xs mb-6 font-light">Bríndanos métricas de escala física y especificaciones operativas.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                              Área de Intervención (Opcional)
                            </label>
                            <input
                              type="text"
                              name="area"
                              value={formData.area}
                              onChange={handleChange}
                              placeholder="Ej. 150 Hectáreas o 2500 m²"
                              className="w-full bg-slate-900 border border-slate-850 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-light text-sm placeholder:text-slate-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                              Presupuesto Estimado USD (Opcional)
                            </label>
                            <input
                              type="text"
                              name="presupuesto"
                              value={formData.presupuesto}
                              onChange={handleChange}
                              placeholder="Ej. $15,000 USD"
                              className="w-full bg-slate-900 border border-slate-850 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-light text-sm placeholder:text-slate-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                            Descripción Técnica del Requerimiento *
                          </label>
                          <textarea
                            name="descripcion"
                            required
                            rows={5}
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Describa el alcance de la consultoría, los objetivos operativos o las especificaciones del terreno..."
                            className="w-full bg-slate-900 border border-slate-850 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none font-light text-sm placeholder:text-slate-500"
                          ></textarea>
                        </div>
                      </motion.div>
                    )}

                    {/* PASO 3: DROPZONE CAD/GIS */}
                    {step === 3 && !isQuickConsult && (
                      <motion.div
                        key="step3"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">Zona de Carga Técnica (GIS/CAD)</h3>
                          <p className="text-gray-400 text-xs mb-6 font-light">Adjunta polígonos, curvas de nivel o puntos de referencia del terreno.</p>
                        </div>

                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
                            isDragActive
                              ? 'border-yellow-400 bg-yellow-400/5'
                              : 'border-slate-800 hover:border-slate-700 bg-slate-900/20'
                          }`}
                        >
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-400">
                              <UploadCloud size={32} className={isDragActive ? 'text-yellow-400' : 'text-slate-400'} />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">Arroja tu archivo cartográfico aquí</p>
                              <p className="text-xs text-slate-400 mt-1">Formatos de ingeniería soportados: .KMZ, .SHP, .DWG, .DXF (Máx. 10MB)</p>
                            </div>
                          </div>
                        </div>

                        {fileError && (
                          <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs leading-relaxed animate-in slide-in-from-top-2 duration-300">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{fileError}</span>
                          </div>
                        )}

                        {uploadedFile && (
                          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-xl flex items-center justify-center shrink-0">
                                <File size={20} />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-white text-xs font-bold truncate max-w-[200px] sm:max-w-xs">{uploadedFile.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-colors"
                              title="Remover archivo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* PASO 4: CONTACTO & ENVÍO */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">
                            {isQuickConsult ? 'Enlace Directo' : 'Información de Enlace Corporativo'}
                          </h3>
                          <p className="text-gray-400 text-xs mb-6 font-light">
                            {isQuickConsult ? 'Indícanos cómo contactarte y tu mensaje principal.' : 'Completa los datos de contacto para la entrega del informe técnico comercial.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                              Nombre Completo *
                            </label>
                            <input
                              type="text"
                              name="nombre"
                              required
                              value={formData.nombre}
                              onChange={handleChange}
                              placeholder="Ej. Ing. Juan Pérez"
                              className="w-full bg-slate-900 border border-slate-850 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-light text-sm placeholder:text-slate-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                              Empresa / Institución {isQuickConsult && '(Opcional)'}
                            </label>
                            <div className="relative">
                              <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                              <input
                                type="text"
                                name="empresa"
                                required={!isQuickConsult}
                                value={formData.empresa}
                                onChange={handleChange}
                                placeholder="Ej. Minera del Norte S.A."
                                className="w-full bg-slate-900 border border-slate-850 p-4 pl-12 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-light text-sm placeholder:text-slate-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                              Correo Corporativo / Personal *
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="ejemplo@empresa.com"
                              className={`w-full bg-slate-900 border p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-light text-sm placeholder:text-slate-500 ${
                                emailError ? 'border-red-500 focus:ring-red-500' : 'border-slate-850'
                              }`}
                            />
                            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                              Teléfono / WhatsApp *
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                              <input
                                type="tel"
                                name="telefono"
                                required
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Ej. +57 300 123 4567"
                                className="w-full bg-slate-900 border border-slate-850 p-4 pl-12 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-light text-sm placeholder:text-slate-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Free-text Message field for Quick Consult */}
                        {isQuickConsult && (
                          <div className="col-span-1 sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                              Detalle de su Consulta *
                            </label>
                            <textarea
                              name="descripcion"
                              required
                              rows={5}
                              value={formData.descripcion}
                              onChange={handleChange}
                              placeholder="Describa brevemente su consulta, duda o el servicio del cual requiere información..."
                              className="w-full bg-slate-900 border border-slate-850 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none font-light text-sm placeholder:text-slate-500"
                            ></textarea>
                          </div>
                        )}

                        {/* Cloudflare Turnstile Captcha Container */}
                        <div className="flex justify-center my-4">
                          <div ref={turnstileContainerRef}></div>
                        </div>

                        {status === 'error' && (
                          <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>Ocurrió un error al enviar el formulario. Por favor, intente de nuevo.</span>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* NAVEGACIÓN */}
                    <div className="flex gap-4 pt-6 border-t border-slate-900">
                      {((step > 1 && !isQuickConsult) || (step === 4 && isQuickConsult)) && (
                        <button
                          type="button"
                          onClick={prevStep}
                          disabled={status === 'loading'}
                          className="px-6 py-4 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                          <ChevronLeft size={18} /> Atrás
                        </button>
                      )}
                      
                      {step < 4 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!canGoNext()}
                          className="flex-1 bg-yellow-400 text-[#1a2a44] p-4 rounded-xl font-bold hover:bg-yellow-300 transition-all shadow-[0_4px_20px_rgba(250,204,21,0.15)] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Continuar <ChevronRight size={18} />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="flex-1 bg-[#facc15] text-[#1a2a44] p-4 rounded-xl font-bold hover:bg-yellow-300 transition-all shadow-[0_4px_20px_rgba(250,204,21,0.15)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {status === 'loading' ? (
                            <>
                              <Loader className="animate-spin" size={18} />
                              Procesando...
                            </>
                          ) : (
                            <>
                              Enviar Solicitud <Check size={18} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
