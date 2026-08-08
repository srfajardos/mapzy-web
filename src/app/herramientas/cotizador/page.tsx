'use client';

import React, { useState, useEffect, useId, useRef } from 'react';
import Link from 'next/link';
import { Calculator, Printer, CheckCircle2, ChevronLeft, ShieldCheck, DollarSign, FileText, Lock, Key, Compass, Layers, LogOut, Copy, Check, Trash2, Download, FolderOpen, Send, Loader2, PenTool, RefreshCw, PlusCircle } from 'lucide-react';

interface ServicioOption {
  id: string;
  nombre: string;
  subtitulo: string;
  precioBaseHa: number;
  minimoGarantizado: number;
  diasCampoBase: number;
  diasGabineteBase: number;
  descripcion: string;
  entregables: string[];
}

interface CotizacionGuardada {
  id: string;
  fecha: string;
  servicioId: string;
  servicioNombre: string;
  hectareas: number;
  cliente: string;
  nitCliente: string;
  contacto: string;
  ubicacion: string;
  nombreProyecto: string;
  precioFinal: number;
  descuentoPercent: number;
  usarAjusteManual: boolean;
  precioManual: number;
}

const SERVICIOS: ServicioOption[] = [
  {
    id: 'tipo1',
    nombre: '1. Reconocimiento Aéreo e Inspección',
    subtitulo: 'Vuelo panorámico, ortomosaico rápido y diagnóstico pre-inversión',
    precioBaseHa: 45000,
    minimoGarantizado: 2000000,
    diasCampoBase: 1,
    diasGabineteBase: 2,
    descripcion: 'Diseñado para evaluar la topografía general, accesos, invasiones, cuerpos de agua y restricciones físicas antes de tomar decisiones de compra o inversión.',
    entregables: [
      'Ortofotomapa panorámico de alta resolución en formato GeoTIFF',
      'Registro fotográfico/videográfico aéreo 4K del terreno',
      'Informe preliminar de restricciones físicas y pendientes'
    ]
  },
  {
    id: 'tipo2',
    nombre: '2. Linderos, Inmobiliaria y Catastro',
    subtitulo: 'Amarre a red MAGNA-SIRGAS IGAC, deslinde y amojonamiento en campo',
    precioBaseHa: 75000,
    minimoGarantizado: 3000000,
    diasCampoBase: 2,
    diasGabineteBase: 3,
    descripcion: 'Orientado a deslindes notariales, escrituración, aclaración de áreas e incorporación en Catastro Multipropósito con georreferenciación oficial IGAC.',
    entregables: [
      'Plano topográfico catastral en formato AutoCAD (.DWG)',
      'Cuadro oficial de coordenadas de vértices en sistema CTM12',
      'Amojonamiento de vértices en campo con estacas/concreto',
      'Memoria técnica firmada por Topógrafo Matriculado'
    ]
  },
  {
    id: 'tipo3',
    nombre: '3. Alta Precisión, MDT y Cubaje ANM',
    subtitulo: 'Topografía de detalle para ingeniería, curvas de nivel y cálculo de reservas',
    precioBaseHa: 100000,
    minimoGarantizado: 4000000,
    diasCampoBase: 3,
    diasGabineteBase: 4,
    descripcion: 'El producto especializado para canteras, títulos mineros (ANM), licencias de construcción y obras civiles. Proporciona control terrestre de máxima precisión.',
    entregables: [
      'Modelo Digital de Terreno (MDT) y Modelo Digital de Superficie (MDS)',
      'Nube de puntos georreferenciada de alta densidad (.LAS)',
      'Mapa de curvas de nivel cada 0.25m - 0.50m',
      'Reporte de cálculo de volumen/cubaje de material y reservas',
      'Capítulo Geológico-Minero listo para radicación ante ANM'
    ]
  }
];

export default function CotizadorTopografiaPage() {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const pinInputId = useId();
  const numCotizacionId = useId();
  const haInputId = useId();
  const descInputId = useId();
  const manualInputId = useId();
  const empresaInputId = useId();
  const nitInputId = useId();
  const emailInputId = useId();
  const contactoInputId = useId();
  const ubicacionInputId = useId();
  const proyectoInputId = useId();
  const trmInputId = useId();

  // Autenticación por PIN
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Estados de la Cotización
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioOption>(SERVICIOS[2]);
  const [hectareasInput, setHectareasInput] = useState<string>('30');
  const [descuentoInput, setDescuentoInput] = useState<string>('0');
  const [usarAjusteManual, setUsarAjusteManual] = useState<boolean>(false);
  const [precioManual, setPrecioManual] = useState<number>(4000000);
  const [numCotizacion, setNumCotizacion] = useState<string>('MPZ-2026-001');

  // Formulario del Cliente
  const [cliente, setCliente] = useState<string>('');
  const [nitCliente, setNitCliente] = useState<string>('');
  const [emailCliente, setEmailCliente] = useState<string>('');
  const [contacto, setContacto] = useState<string>('');
  const [ubicacion, setUbicacion] = useState<string>('');
  const [nombreProyecto, setNombreProyecto] = useState<string>('');

  // Modos especiales
  const [mostrarUSD, setMostrarUSD] = useState<boolean>(false);
  const [trmUSD, setTrmUSD] = useState<number>(4000);
  const [cargandoTRM, setCargandoTRM] = useState<boolean>(false);
  const [copiadoWs, setCopiadoWs] = useState<boolean>(false);

  // Estado de Generación PDF & Envío por Correo
  const [descargandoPDF, setDescargandoPDF] = useState<boolean>(false);
  const [enviandoEmail, setEnviandoEmail] = useState<boolean>(false);
  const [mensajeEmailStatus, setMensajeEmailStatus] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  // Historial Local
  const [historial, setHistorial] = useState<CotizacionGuardada[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState<boolean>(false);

  // Cargar sesión, TRM en vivo y Consecutivo desde localStorage al iniciar
  useEffect(() => {
    const authSession = sessionStorage.getItem('mapzy_cotizador_auth');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }

    const savedCounter = localStorage.getItem('mapzy_quote_counter');
    if (savedCounter) {
      const nextNum = parseInt(savedCounter, 10) + 1;
      const formatted = `MPZ-2026-${nextNum.toString().padStart(3, '0')}`;
      setNumCotizacion(formatted);
    }

    const savedHistory = localStorage.getItem('mapzy_quote_history_list');
    if (savedHistory) {
      try {
        setHistorial(JSON.parse(savedHistory));
      } catch {
        console.warn('Error al leer historial local');
      }
    }

    fetchTRMEnVivo();
  }, []);

  const fetchTRMEnVivo = () => {
    setCargandoTRM(true);
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.COP) {
          setTrmUSD(Math.round(data.rates.COP));
        }
      })
      .catch(() => console.warn('Usando TRM por defecto'))
      .finally(() => setCargandoTRM(false));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '2326') {
      setIsAuthenticated(true);
      sessionStorage.setItem('mapzy_cotizador_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mapzy_cotizador_auth');
    setPinInput('');
  };

  const rawHa = parseFloat(hectareasInput) || 0;
  const hectareas = Math.min(1000000, Math.max(1, isNaN(rawHa) ? 1 : rawHa));
  const descuentoPercent = Math.min(50, Math.max(0, parseFloat(descuentoInput) || 0));

  const calcularPrecioBase = () => {
    let factorEscala = 1.0;
    if (hectareas > 300) factorEscala = 0.45;
    else if (hectareas > 150) factorEscala = 0.60;
    else if (hectareas > 80) factorEscala = 0.75;
    else if (hectareas > 40) factorEscala = 0.88;

    const costoCalculado = Math.round(hectareas * servicioSeleccionado.precioBaseHa * factorEscala + servicioSeleccionado.minimoGarantizado);
    return Math.max(costoCalculado, servicioSeleccionado.minimoGarantizado);
  };

  const precioBase = calcularPrecioBase();
  const valorDescuento = Math.round(precioBase * (descuentoPercent / 100));
  const precioFinalCalculado = precioBase - valorDescuento;
  const precioFinal = usarAjusteManual ? precioManual : precioFinalCalculado;

  const formatoCOP = (valor: number) => {
    if (isNaN(valor) || !isFinite(valor)) return '$ 0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  };

  const formatoUSD = (valorCOP: number) => {
    if (isNaN(valorCOP) || !isFinite(valorCOP)) return '$0';
    const usd = valorCOP / (trmUSD || 4000);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(usd);
  };

  // Nombre Dinámico del Archivo PDF Único
  const obtenerNombreArchivoPDF = () => {
    const clienteLimpio = (cliente || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_');
    const numLimpio = (numCotizacion || 'MPZ-2026-001').replace(/[^a-zA-Z0-9-]/g, '');
    const fecha = new Date().toISOString().slice(0, 10);
    return `Propuesta_Comercial_Mapzy_${numLimpio}_${clienteLimpio}_${fecha}.pdf`;
  };

  // Fecha de Vencimiento (+15 días)
  const fechaHoy = new Date();
  const fechaVencimiento = new Date(fechaHoy.setDate(fechaHoy.getDate() + 15)).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

  // Guardar en el Historial Local
  const guardarEnHistorial = () => {
    const nuevaCotizacion: CotizacionGuardada = {
      id: numCotizacion || 'MPZ-2026-001',
      fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
      servicioId: servicioSeleccionado.id,
      servicioNombre: servicioSeleccionado.nombre,
      hectareas,
      cliente: cliente || '[Cliente Sin Nombre]',
      nitCliente,
      contacto,
      ubicacion,
      nombreProyecto: nombreProyecto || '[Proyecto Sin Nombre]',
      precioFinal,
      descuentoPercent,
      usarAjusteManual,
      precioManual
    };

    const actualizado = [nuevaCotizacion, ...historial.filter(h => h.id !== nuevaCotizacion.id)];
    setHistorial(actualizado);
    localStorage.setItem('mapzy_quote_history_list', JSON.stringify(actualizado));

    const match = numCotizacion.match(/\d+$/);
    if (match) {
      const currentNum = parseInt(match[0], 10);
      localStorage.setItem('mapzy_quote_counter', currentNum.toString());
    }
  };

  // Botón ✨ Nueva Cotización
  const nuevaCotizacion = () => {
    const match = numCotizacion.match(/\d+$/);
    if (match) {
      const nextNum = parseInt(match[0], 10) + 1;
      setNumCotizacion(`MPZ-2026-${nextNum.toString().padStart(3, '0')}`);
    } else {
      setNumCotizacion('MPZ-2026-001');
    }
    setCliente('');
    setNitCliente('');
    setEmailCliente('');
    setContacto('');
    setUbicacion('');
    setNombreProyecto('');
    setDescuentoInput('0');
    setUsarAjusteManual(false);
    setMensajeEmailStatus(null);
  };

  // Descarga Directa de PDF en 1 Clic
  const descargarPDFDirecto = async () => {
    if (!printAreaRef.current) return;
    setDescargandoPDF(true);
    guardarEnHistorial();

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = printAreaRef.current;
      const filename = obtenerNombreArchivoPDF();

      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.warn('Fallback a ventana de impresión nativa:', err);
      window.print();
    } finally {
      setDescargandoPDF(false);
    }
  };

  // Generación Directa de PDF Base64 Infallible usando html2canvas + jsPDF Directo
  const generarPDFBase64Directo = async (element: HTMLElement): Promise<string> => {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter'
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 8.5, 11);
    const dataUri = pdf.output('datauristring');
    return dataUri;
  };

  // Enviar por Correo con PDF Adjunto Garantizado
  const enviarCotizacionCorreo = async () => {
    if (!emailCliente || !emailCliente.includes('@')) {
      setMensajeEmailStatus({ tipo: 'error', texto: 'Por favor ingresa un correo electrónico de cliente válido.' });
      return;
    }

    setEnviandoEmail(true);
    setMensajeEmailStatus(null);
    guardarEnHistorial();

    try {
      let pdfBase64 = '';
      const filename = obtenerNombreArchivoPDF();

      if (printAreaRef.current) {
        try {
          pdfBase64 = await generarPDFBase64Directo(printAreaRef.current);
        } catch (pdfErr) {
          console.warn('Error generando PDF Base64 directo:', pdfErr);
        }
      }

      const response = await fetch('/api/cotizacion/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numCotizacion,
          cliente: cliente || '[Nombre del Cliente]',
          nitCliente,
          contacto: contacto || '[Contacto]',
          ubicacion: ubicacion || 'Colombia',
          nombreProyecto: nombreProyecto || 'Servicios Geoespaciales',
          hectareas,
          servicioNombre: servicioSeleccionado.nombre,
          servicioDescripcion: servicioSeleccionado.descripcion,
          entregables: servicioSeleccionado.entregables,
          precioFinalFormatted: formatoCOP(precioFinal),
          emailCliente,
          pdfBase64,
          filename,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        const destStr = (resData.recipients || []).join(', ');
        setMensajeEmailStatus({
          tipo: 'exito',
          texto: `¡Cotización ${numCotizacion} enviada con éxito a ${resData.recipientsCount || 1} destinatario(s) [${destStr}] con el PDF adjunto completo! (Copia en srfajardos@gmail.com)`
        });
      } else {
        setMensajeEmailStatus({
          tipo: 'error',
          texto: resData.error || 'Ocurrió un problema al enviar el correo.'
        });
      }
    } catch {
      setMensajeEmailStatus({
        tipo: 'error',
        texto: 'Error de conexión enviando el correo.'
      });
    } finally {
      setEnviandoEmail(false);
    }
  };

  const cargarDesdeHistorial = (item: CotizacionGuardada) => {
    setNumCotizacion(item.id);
    const serv = SERVICIOS.find(s => s.id === item.servicioId) || SERVICIOS[2];
    setServicioSeleccionado(serv);
    setHectareasInput(item.hectareas.toString());
    setCliente(item.cliente === '[Cliente Sin Nombre]' ? '' : item.cliente);
    setNitCliente(item.nitCliente || '');
    setContacto(item.contacto || '');
    setUbicacion(item.ubicacion || '');
    setNombreProyecto(item.nombreProyecto === '[Proyecto Sin Nombre]' ? '' : item.nombreProyecto);
    setDescuentoInput(item.descuentoPercent.toString());
    setUsarAjusteManual(item.usarAjusteManual);
    if (item.precioManual) setPrecioManual(item.precioManual);
  };

  const eliminarDeHistorial = (id: string) => {
    const filtrado = historial.filter(h => h.id !== id);
    setHistorial(filtrado);
    localStorage.setItem('mapzy_quote_history_list', JSON.stringify(filtrado));
  };

  const exportarHistorialCSV = () => {
    if (historial.length === 0) return;
    const headers = ['Consecutivo,Fecha,Cliente,NIT,Proyecto,Ubicación,Servicio,Hectáreas,Precio Final (COP)\n'];
    const rows = historial.map(h => 
      `"${h.id}","${h.fecha}","${h.cliente.replace(/"/g, '""')}","${h.nitCliente}","${h.nombreProyecto.replace(/"/g, '""')}","${h.ubicacion}","${h.servicioNombre}",${h.hectareas},${h.precioFinal}`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Historial_Cotizaciones_Mapzy_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copiarResumenWhatsApp = () => {
    const texto = `📌 *PROPUESTA COMERCIAL MAPZY S.A.S.* N° *${numCotizacion}*
🏢 *Cliente:* ${cliente || '[Cliente]'} ${nitCliente ? `(NIT: ${nitCliente})` : ''}
👤 *Atención:* ${contacto || '[Contacto]'}
📍 *Ubicación:* ${ubicacion || 'Colombia'}
🗺️ *Proyecto:* ${nombreProyecto || '[Proyecto]'} (${hectareas} Ha)
⚙️ *Servicio:* ${servicioSeleccionado.nombre}

💰 *INVERSIÓN TOTAL:* *${formatoCOP(precioFinal)} COP* ${mostrarUSD ? `(${formatoUSD(precioFinal)})` : ''}

✅ *Entregables incluidos:*
• Ortofotomapa / Modelo Digital de Terreno (MDT)
• Curvas de Nivel / Nube de Puntos (.LAS)
• Almacenamiento seguro en Google Drive 5TB Mapzy

🌐 *Mapzy S.A.S.* | www.mapzy.com.co | Bogotá D.C., Colombia`;

    navigator.clipboard.writeText(texto);
    setCopiadoWs(true);
    setTimeout(() => setCopiadoWs(false), 3000);
  };

  // Pantalla de Bloqueo por PIN
  if (!isAuthenticated) {
    return (
      <div className="bg-[#1a2a44] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-yellow-400 text-center flex flex-col justify-center items-center">
          <div className="w-16 h-16 bg-[#1a2a44] text-yellow-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-[#1a2a44] mb-1">Acceso Restringido</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6">
            Herramienta Comercial Mapzy S.A.S.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 w-full text-left">
            <div>
              <label htmlFor={pinInputId} className="text-xs font-bold text-slate-700 block mb-1 text-center">
                Ingresa la clave de acceso de Mapzy Tools:
              </label>
              <div className="relative">
                <input
                  id={pinInputId}
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="****"
                  className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-2xl text-center text-xl font-black tracking-[0.5em] text-[#1a2a44] focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  autoFocus
                />
                <Key className="absolute left-4 top-3.5 text-slate-400" size={20} />
              </div>
              {pinError && (
                <span className="text-xs text-red-600 font-bold block mt-2 text-center">
                  Clave incorrecta. Intenta nuevamente.
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#1a2a44] font-black py-3.5 rounded-2xl transition-all shadow-md text-sm uppercase tracking-wider cursor-pointer"
            >
              Ingresar al Cotizador
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center w-full">
            Mapzy S.A.S. — Bogotá D.C., Colombia
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Estilos de Impresión Nativa Fallback */}
      <style jsx global>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0 !important;
          }
          html, body {
            height: 100% !important;
            overflow: hidden !important;
            background-color: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          nav, footer, .no-print, header {
            display: none !important;
          }
          .print-area {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Header Interactivo (no-print) */}
      <div className="bg-[#1a2a44] text-white py-10 px-4 border-b-4 border-yellow-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link
              href="/herramientas"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-xs font-bold uppercase tracking-wider mb-2"
            >
              <ChevronLeft size={16} /> Volver al Hub de Herramientas
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
              <Calculator className="text-yellow-400" size={32} /> Cotizador Comercial Mapzy
            </h1>
            <p className="text-slate-300 text-xs mt-1">
              Calculadora de tarifas de topografía, fotogrametría y estudios de geología en Colombia.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={nuevaCotizacion}
              className="bg-yellow-400 hover:bg-yellow-300 text-[#1a2a44] font-black px-4 py-3 rounded-2xl flex items-center gap-2 text-xs transition-all cursor-pointer shadow-md"
              title="Iniciar una nueva cotización limpia"
            >
              <PlusCircle size={16} /> Nueva Cotización
            </button>
            <button
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
              className="bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 font-bold px-4 py-3 rounded-2xl flex items-center gap-2 text-xs transition-all cursor-pointer"
            >
              <FolderOpen size={16} /> Historial ({historial.length})
            </button>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-200 border border-slate-700 font-bold px-3.5 py-3 rounded-2xl flex items-center gap-2 text-xs transition-all cursor-pointer"
              title="Cerrar Sesión del Cotizador"
            >
              <LogOut size={16} /> Bloquear
            </button>
            <button
              onClick={descargarPDFDirecto}
              disabled={descargandoPDF}
              className="bg-yellow-400 hover:bg-yellow-300 text-[#1a2a44] font-black px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:scale-105 transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              {descargandoPDF ? <Loader2 className="animate-spin" size={18} /> : <Printer size={18} />}
              {descargandoPDF ? 'Generando PDF...' : '🖨️ Descargar PDF Oficial'}
            </button>
          </div>
        </div>
      </div>

      {/* Historial Local Desplegable (no-print) */}
      {mostrarHistorial && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 no-print">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-[#1a2a44] uppercase tracking-wider flex items-center gap-2">
                <FolderOpen className="text-yellow-500" size={20} /> Historial Local de Cotizaciones (Guardadas en este equipo)
              </h3>
              {historial.length > 0 && (
                <button
                  onClick={exportarHistorialCSV}
                  className="bg-green-100 hover:bg-green-200 text-green-800 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={14} /> Descargar Excel (CSV)
                </button>
              )}
            </div>

            {historial.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No hay cotizaciones guardadas en este navegador aún. Al exportar a PDF se guardan automáticamente.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
                {historial.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl gap-2 hover:bg-yellow-50/40 transition-colors"
                  >
                    <div>
                      <span className="font-black text-xs text-[#1a2a44] bg-yellow-300/40 px-2 py-0.5 rounded-lg mr-2">
                        {item.id}
                      </span>
                      <span className="font-bold text-xs text-slate-800">{item.cliente}</span>
                      <span className="text-[11px] text-slate-500 ml-2">({item.hectareas} Ha — {item.ubicacion || 'Colombia'})</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.fecha} — {item.nombreProyecto}</div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="font-black text-sm text-[#1a2a44] mr-2">
                        {formatoCOP(item.precioFinal)}
                      </span>
                      <button
                        onClick={() => cargarDesdeHistorial(item)}
                        className="bg-[#1a2a44] text-yellow-400 hover:bg-yellow-400 hover:text-[#1a2a44] font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        Cargar
                      </button>
                      <button
                        onClick={() => eliminarDeHistorial(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Panel de Controles e Inputs (no-print) */}
          <div className="lg:col-span-5 space-y-6 no-print">
            
            {/* 1. Seleccionar Tipo de Trabajo */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1a2a44] mb-3 flex items-center gap-2">
                <Layers className="text-yellow-500" size={18} /> 1. Tipo de Servicio
              </h2>
              <div className="space-y-2.5">
                {SERVICIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setServicioSeleccionado(s)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      servicioSeleccionado.id === s.id
                        ? 'border-yellow-400 bg-yellow-50/50 shadow-md ring-2 ring-yellow-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#1a2a44]">{s.nombre}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{s.subtitulo}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Área en Hectáreas */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <label htmlFor={haInputId} className="text-xs font-black uppercase tracking-wider text-[#1a2a44] block mb-2">
                2. Área del Predio (Hectáreas)
              </label>
              
              <div className="flex items-center gap-3 mb-4">
                <input
                  id={haInputId}
                  type="text"
                  inputMode="numeric"
                  value={hectareasInput}
                  onChange={(e) => setHectareasInput(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-2xl text-lg font-black text-[#1a2a44] focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  placeholder="Ej: 30"
                />
                <span className="text-sm font-bold text-slate-500 uppercase">Ha</span>
              </div>

              {/* Botones de Selección de Rangos */}
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Rangos de Referencia:</div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { label: '0 a 30 Ha', val: '30' },
                  { label: '30 a 50 Ha', val: '50' },
                  { label: '50 a 100 Ha', val: '100' },
                  { label: '100 a 200 Ha', val: '200' },
                  { label: '200 a 500 Ha', val: '500' },
                  { label: '> 500 Ha', val: '750' }
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setHectareasInput(r.val)}
                    className={`py-1.5 px-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                      hectareasInput === r.val
                        ? 'bg-[#1a2a44] text-yellow-400 border-[#1a2a44]'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Negociación Comercial & Dólares en Tiempo Real */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1a2a44] mb-3 flex items-center gap-2">
                <DollarSign className="text-green-600" size={18} /> 3. Negociación &amp; Moneda (USD)
              </h2>

              <div className="mb-4">
                <label htmlFor={descInputId} className="text-xs font-bold text-slate-600 block mb-1">
                  Descuento Comercial (%):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={descInputId}
                    type="text"
                    inputMode="numeric"
                    value={descuentoInput}
                    disabled={usarAjusteManual}
                    onChange={(e) => setDescuentoInput(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm font-bold text-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none disabled:opacity-50"
                    placeholder="0"
                  />
                  <span className="font-bold text-slate-500">%</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usarAjusteManual}
                    onChange={(e) => setUsarAjusteManual(e.target.checked)}
                    className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#1a2a44]">
                    Fijar Tarifa Especial Cerrada (COP)
                  </span>
                </label>

                {usarAjusteManual && (
                  <div className="mt-2 text-left">
                    <label htmlFor={manualInputId} className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                      Valor Total Acordado (COP):
                    </label>
                    <input
                      id={manualInputId}
                      type="number"
                      value={precioManual}
                      onChange={(e) => setPrecioManual(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm font-bold text-[#1a2a44] focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    />
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={mostrarUSD}
                      onChange={(e) => setMostrarUSD(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                    Mostrar Dólares (USD)
                  </label>

                  {mostrarUSD && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400">TRM Hoy:</span>
                      <input
                        id={trmInputId}
                        type="number"
                        value={trmUSD}
                        onChange={(e) => setTrmUSD(parseInt(e.target.value, 10) || 4000)}
                        className="w-20 px-2 py-1 text-xs border border-slate-300 rounded-lg text-center font-bold text-[#1a2a44]"
                      />
                      <button
                        onClick={fetchTRMEnVivo}
                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        title="Actualizar TRM en tiempo real"
                      >
                        <RefreshCw size={14} className={cargandoTRM ? 'animate-spin' : ''} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Consecutivo y Datos del Cliente */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1a2a44] mb-2 flex items-center gap-2">
                <FileText className="text-blue-600" size={18} /> 4. Datos del Cliente &amp; Consecutivo
              </h2>
              <div>
                <label htmlFor={numCotizacionId} className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Nº de Cotización / Consecutivo:
                </label>
                <input
                  id={numCotizacionId}
                  type="text"
                  value={numCotizacion}
                  onChange={(e) => setNumCotizacion(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl text-[#1a2a44] focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor={empresaInputId} className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Empresa / Cliente:</label>
                <input
                  id={empresaInputId}
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Ej: [Nombre de la Empresa o Cliente]"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor={nitInputId} className="text-[10px] font-bold text-slate-500 uppercase block mb-1">NIT / Identificación Cliente (Opcional):</label>
                <input
                  id={nitInputId}
                  type="text"
                  value={nitCliente}
                  onChange={(e) => setNitCliente(e.target.value)}
                  placeholder="Ej: [NIT / C.C. del Cliente]"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor={emailInputId} className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Correo(s) del Cliente (Separar con coma para múltiples):</label>
                <input
                  id={emailInputId}
                  type="text"
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  placeholder="Ej: cliente@empresa.com, socio@empresa.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor={contactoInputId} className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Contacto / Atención:</label>
                <input
                  id={contactoInputId}
                  type="text"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  placeholder="Ej: [Nombre del Contacto / Cargo]"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor={ubicacionInputId} className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ubicación del Predio:</label>
                <input
                  id={ubicacionInputId}
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Ej: [Municipio, Departamento]"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor={proyectoInputId} className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nombre del Proyecto:</label>
                <input
                  id={proyectoInputId}
                  type="text"
                  value={nombreProyecto}
                  onChange={(e) => setNombreProyecto(e.target.value)}
                  placeholder="Ej: [Nombre del Proyecto / Referencia]"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Acciones Rápidas (Correo & WhatsApp) */}
            <div className="space-y-2.5">
              <button
                onClick={enviarCotizacionCorreo}
                disabled={enviandoEmail}
                className="w-full bg-[#1a2a44] hover:bg-slate-800 text-yellow-400 font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all text-xs cursor-pointer disabled:opacity-50"
              >
                {enviandoEmail ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {enviandoEmail ? 'Generando PDF & Enviando Correo...' : '📧 Enviar Cotización por Correo (con PDF Adjunto)'}
              </button>

              {mensajeEmailStatus && (
                <div className={`p-3 rounded-xl text-xs font-bold text-center ${
                  mensajeEmailStatus.tipo === 'exito' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {mensajeEmailStatus.texto}
                </div>
              )}

              <button
                onClick={copiarResumenWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all text-xs cursor-pointer"
              >
                {copiadoWs ? <Check size={18} /> : <Copy size={18} />}
                {copiadoWs ? '¡Resumen Copiado al Portapapeles!' : '📋 Copiar Resumen para WhatsApp'}
              </button>
            </div>

          </div>

          {/* Vista Previa Calibrada Exacta para 1 Sola Hoja Carta */}
          <div className="lg:col-span-7">
            <div
              ref={printAreaRef}
              id="cotizacion-imprimible"
              className="print-area bg-white border border-slate-200 shadow-xl overflow-hidden rounded-none flex flex-col justify-between"
            >
              <div>
                {/* Encabezado Único de la Cotización Mapzy */}
                <div className="bg-[#1a2a44] text-white p-6 border-b-4 border-yellow-400 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                        <Compass className="text-[#1a2a44]" size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-yellow-400 tracking-tight">Mapzy S.A.S.</h2>
                        <p className="text-slate-300 text-[9.5px] font-bold uppercase tracking-widest mt-0.5">
                          INTELIGENCIA GEOESPACIAL &amp; INGENIERÍA TERRITORIAL
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        PROPUESTA COMERCIAL N° {numCotizacion || 'MPZ-2026-001'}
                      </span>
                      <div className="text-slate-300 text-[10.5px] mt-1.5 font-medium">
                        Fecha: {new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadatos del Cliente */}
                <div className="p-6">
                  <table className="w-full text-xs border-collapse mb-4">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold text-[#1a2a44] bg-slate-50 px-3 w-24">Cliente:</td>
                        <td className="py-2 px-3 text-slate-700 font-semibold">
                          {cliente || '[Nombre de la Empresa / Cliente]'}
                          {nitCliente && <span className="text-[#1a2a44] font-normal text-[10.5px] block">NIT/ID: {nitCliente}</span>}
                        </td>
                        <td className="py-2 font-bold text-[#1a2a44] bg-slate-50 px-3 w-24">Vigencia:</td>
                        <td className="py-2 px-3 text-slate-700">15 días (hasta {fechaVencimiento})</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold text-[#1a2a44] bg-slate-50 px-3">Atención:</td>
                        <td className="py-2 px-3 text-slate-700">{contacto || '[Nombre del Contacto / Cargo]'}</td>
                        <td className="py-2 font-bold text-[#1a2a44] bg-slate-50 px-3">Ubicación:</td>
                        <td className="py-2 px-3 text-slate-700">{ubicacion || '[Municipio, Departamento]'}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold text-[#1a2a44] bg-slate-50 px-3">Proyecto:</td>
                        <td className="py-2 px-3 text-slate-700 font-semibold" colSpan={3}>
                          {nombreProyecto || '[Nombre del Proyecto]'} ({hectareas.toLocaleString('es-CO')} Hectáreas)
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Alcance del Servicio */}
                  <div className="mb-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#1a2a44] border-l-4 border-yellow-400 pl-2.5 mb-1.5">
                      1. ALCANCE TÉCNICO SELECCIONADO
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {servicioSeleccionado.descripcion}
                    </p>
                  </div>

                  {/* Entregables */}
                  <div className="mb-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#1a2a44] border-l-4 border-yellow-400 pl-2.5 mb-1.5">
                      2. PRODUCTOS Y ENTREGABLES FORMALES
                    </h3>
                    <div className="space-y-1">
                      {servicioSeleccionado.entregables.map((entregable, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                          <CheckCircle2 size={13} className="text-yellow-500 shrink-0 mt-0.5" />
                          <span>{entregable}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desglose de Inversión */}
                  <div className="mb-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#1a2a44] border-l-4 border-yellow-400 pl-2.5 mb-1.5">
                      3. RESUMEN ECONÓMICO
                    </h3>
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#1a2a44] text-white">
                          <th className="py-2 px-3 text-left">Ítem</th>
                          <th className="py-2 px-3 text-left">Descripción del Servicio</th>
                          <th className="py-2 px-3 text-center">Área</th>
                          <th className="py-2 px-3 text-right">Valor Total (COP)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-500">1.01</td>
                          <td className="py-2.5 px-3 font-semibold text-[#1a2a44]">{servicioSeleccionado.nombre}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600 font-bold">{hectareas.toLocaleString('es-CO')} Ha</td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#1a2a44]">{formatoCOP(precioBase)}</td>
                        </tr>
                        {descuentoPercent > 0 && !usarAjusteManual && (
                          <tr className="bg-green-50 text-green-800">
                            <td className="py-1.5 px-3 font-bold">Desc.</td>
                            <td className="py-1.5 px-3 italic" colSpan={2}>Descuento Comercial de Escala ({descuentoPercent}%)</td>
                            <td className="py-1.5 px-3 text-right font-bold">- {formatoCOP(valorDescuento)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Cuadro Total */}
                    <div className="bg-[#1a2a44] text-white p-4 rounded-2xl mt-3 flex justify-between items-center shadow-lg border border-yellow-400/20">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block leading-normal">
                          INVERSIÓN TOTAL FINAL
                        </span>
                        <span className="text-[9.5px] text-yellow-300 font-medium block leading-normal">
                          {usarAjusteManual ? 'Tarifa Especial Acordada' : 'Régimen Especial - Incluye Procesamiento'}
                        </span>
                      </div>
                      <div className="text-right pl-4">
                        <div className="text-2xl font-black text-yellow-400 leading-tight">
                          {formatoCOP(precioFinal)}
                        </div>
                        {mostrarUSD && (
                          <div className="text-[11px] text-slate-300 font-bold mt-1">
                            ≈ {formatoUSD(precioFinal)} (TRM: ${trmUSD})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Condiciones Comerciales */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-[10.5px] text-slate-600 space-y-1 leading-normal mb-4">
                    <div className="font-bold text-[#1a2a44] uppercase mb-0.5 flex items-center gap-1.5 text-[11px]">
                      <ShieldCheck size={13} className="text-yellow-500" /> CONDICIONES COMERCIALES MAPZY:
                    </div>
                    <div>• <strong>Forma de Pago:</strong> 50% de anticipo al firmar acta de inicio y 50% contra entrega e inspección de productos.</div>
                    <div>• <strong>Tiempo de Ejecución:</strong> {servicioSeleccionado.diasCampoBase} días de trabajo en campo + {servicioSeleccionado.diasGabineteBase} días de procesamiento.</div>
                    <div>• <strong>Almacenamiento Seguro:</strong> Los productos se cargarán en la nube de Google Drive de Mapzy (5TB) con enlace directo de descarga.</div>
                  </div>

                  {/* Firmas Comerciales / Contrato */}
                  <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-2 gap-6 text-center text-[10px] text-slate-500">
                    <div>
                      <div className="border-b border-slate-300 mb-1.5 h-8 flex items-end justify-center pb-1">
                        <PenTool size={14} className="text-slate-300" />
                      </div>
                      <strong className="text-[#1a2a44] block text-xs">Representante Técnico / Comercial</strong>
                      <span>Mapzy S.A.S.</span>
                    </div>
                    <div>
                      <div className="border-b border-slate-300 mb-1.5 h-8 flex items-end justify-center pb-1">
                        <span className="text-slate-300 italic text-[9px]">Firma / Sello de Aprobación</span>
                      </div>
                      <strong className="text-[#1a2a44] block text-xs">Aceptado y Conformado por el Cliente</strong>
                      <span>{cliente || '[Firma del Cliente]'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pie de Página Institucional de Mapzy S.A.S. */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[9.5px] text-slate-400">
                <strong>Mapzy S.A.S.</strong> | contacto@mapzy.com.co | www.mapzy.com.co | Bogotá D.C., Colombia
              </div>
            </div>

            {/* Segundo Botón de Descarga al final de la página (no-print) */}
            <div className="mt-6 text-center no-print">
              <button
                onClick={descargarPDFDirecto}
                disabled={descargandoPDF}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#1a2a44] font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all text-base cursor-pointer disabled:opacity-50"
              >
                {descargandoPDF ? <Loader2 className="animate-spin" size={22} /> : <Printer size={22} />}
                {descargandoPDF ? 'Generando PDF...' : '🖨️ Descargar PDF Oficial'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
