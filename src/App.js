import React, { useState, useEffect } from "react";
import {
  Music,
  Fingerprint,
  Star,
  Zap,
  Lock,
  PartyPopper,
  CheckCircle,
  Smartphone,
  Mic2,
  Headphones,
  Cake,
  Users,
  Sparkles,
  Loader2,
  Bot,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
} from "lucide-react";

const App = () => {
  const [isScanned, setIsScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [audio, setAudio] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Estados para la IA de Gemini
  const [aiData, setAiData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    // Música con energía K-Pop
    const track = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
    );
    track.loop = true;
    setAudio(track);
    return () => {
      if (track) track.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.log("Interacción requerida"));
    }
    setIsPlaying(!isPlaying);
  };

  const handleScan = () => {
    setIsScanning(true);
    if (navigator.vibrate) navigator.vibrate(200);

    setTimeout(() => {
      setIsScanning(false);
      setIsScanned(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(() => setShowReward(true), 1200);
    }, 2500);
  };

  // ⚠️ Configura aquí tu número de WhatsApp para recibir las confirmaciones.
  const whatsappNumber = "573113630019";

  const handleRSVP = () => {
    const message = encodeURIComponent(
      "¡Hola! Confirmo mi asistencia al Escuadrón de Violeta O. (Operación Debut). ¡Allá nos vemos!"
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  // Imagen actualizada
  const squadImage =
    "https://i.ibb.co/MxRh1nMv/Gemini-Generated-Image-4k2tne4k2tne4k2t.png";

  // --- INTEGRACIÓN GEMINI API ---
  // ⚠️ Adaptación para Vite: usamos import.meta.env en lugar de process.env
  const getApiKey = () => {
    try {
      // Intentamos leer la variable de entorno al estilo Vite
      return import.meta.env.VITE_GEMINI_API_KEY;
    } catch (e) {
      return "";
    }
  };

  const apiKey = getApiKey();

  const fetchAiMission = async () => {
    setIsGenerating(true);
    setAiError(null);

    // Verificación de seguridad antes de intentar la llamada
    if (!apiKey) {
      setAiError("Error del Sistema: Llave de acceso YUNG no detectada.");
      setIsGenerating(false);
      return;
    }

    const prompt = `Actúa como la inteligencia artificial del sistema "Yung Network". 
    La líder Violeta Osorio C. está celebrando su cumpleaños y acaba de reclutar a su escuadrón de baile K-Pop conformado por: Ana, Susana y Violeta H.
    Genera un nombre de grupo de K-Pop épico, moderno y único para ellas (puede mezclar inglés y coreano romanizado). 
    Luego, escribe una "Misión de Debut" personalizada y emocionante de máximo 2 oraciones para su fiesta de cumpleaños hoy.
    Devuelve la respuesta estrictamente en el formato JSON solicitado.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            groupName: {
              type: "STRING",
              description: "El nombre épico del grupo K-Pop",
            },
            mission: {
              type: "STRING",
              description: "La misión de debut de 2 oraciones",
            },
          },
          required: ["groupName", "mission"],
        },
      },
    };

    const attemptFetch = async (retries = 5, delay = 1000) => {
      try {
        // Utilizamos el modelo estable público para evitar bloqueos en CodeSandbox
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const result = await response.json();
        const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (textResponse) {
          // Limpiar el texto en caso de que la IA devuelva bloques de código
          const cleanText = textResponse
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          setAiData(JSON.parse(cleanText));
        } else {
          throw new Error("Respuesta vacía de la IA");
        }
      } catch (error) {
        console.error("Error al conectar con Gemini:", error);
        if (retries > 0) {
          setTimeout(() => attemptFetch(retries - 1, delay * 2), delay);
        } else {
          setAiError("La red de Yung está en mantenimiento. Intenta de nuevo.");
        }
      }
    };

    await attemptFetch();
    setIsGenerating(false);
  };

  const resetConsole = () => {
    setShowReward(false);
    setIsScanned(false);
    setIsScanning(false);
    setAiData(null);
    setAiError(null);
  };

  return (
    <div className="min-h-screen bg-[#050005] text-white font-sans flex items-center justify-center p-4 overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 255, 0.2); }
          50% { box-shadow: 0 0 25px rgba(255, 0, 255, 0.5); }
        }
        .birthday-glow {
          animation: glow 3s infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />

      {/* Luces de ambiente neón */}
      <div className="fixed top-[-10%] left-[-10%] w-[80%] h-[80%] bg-pink-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md bg-black border-2 border-white/5 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/19] birthday-glow overflow-y-auto hide-scrollbar">
        {/* Header de la Comandante */}
        <div className="sticky top-0 w-full h-20 flex justify-between items-center px-8 z-50 bg-gradient-to-b from-black/95 to-black/0 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-pink-500 tracking-[0.3em]">
              COMMANDER: VIOLETA OSORIO C.
            </span>
            <span className="text-[8px] text-cyan-400 font-mono tracking-widest uppercase">
              TERMINAL DE CUMPLEAÑOS
            </span>
          </div>
          <button
            onClick={toggleMusic}
            className={`p-3 rounded-full transition-all border shrink-0 ${
              isPlaying
                ? "bg-pink-600 border-pink-400 shadow-[0_0_15px_#ff00ff]"
                : "bg-white/5 border-white/10"
            }`}
          >
            <Music size={18} className={isPlaying ? "animate-pulse" : ""} />
          </button>
        </div>

        {!showReward ? (
          <div className="flex flex-col items-center justify-between py-8 px-6 text-center min-h-[85vh]">
            <div className="z-10 mt-2 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/50 rounded-full mb-2">
                <Star size={12} className="text-cyan-400" />
                <span className="text-[9px] font-bold text-cyan-100 uppercase tracking-[0.2em]">
                  Escuadrón Completo
                </span>
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter leading-none text-white uppercase">
                BIRTHDAY MISSION:
                <br />
                <span
                  className="text-pink-500"
                  style={{ filter: "drop-shadow(0 0 10px #ff00ff)" }}
                >
                  SPIRIT BEAT
                </span>
              </h1>
            </div>

            {/* Visualización de las 4 Guerreras */}
            <div className="relative w-full flex items-center justify-center py-6">
              <div className="absolute w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] animate-pulse" />
              <div className="relative z-10 w-full px-2 transition-all duration-700 hover:scale-105">
                {!imageError ? (
                  <img
                    src={squadImage}
                    alt="Violeta Osorio y su Escuadrón"
                    className="w-full h-auto rounded-3xl border-2 border-white/20 shadow-2xl object-cover aspect-square"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="bg-neutral-900 border-2 border-pink-500/30 rounded-3xl aspect-square flex flex-col items-center justify-center p-6 border-dashed shadow-[0_0_20px_rgba(255,0,255,0.2)]">
                    <Users
                      size={40}
                      className="text-pink-500 mb-3 animate-bounce"
                    />
                    <p className="text-sm font-black text-white uppercase tracking-widest text-center">
                      SQUAD
                      <br />
                      DETECTADO
                    </p>
                    <div className="mt-4 flex flex-col gap-2 w-full">
                      <div className="bg-pink-500/20 border border-pink-500/50 rounded-lg p-2 text-center">
                        <span className="text-[9px] text-pink-300 font-bold uppercase tracking-widest block mb-1">
                          Comandante (Cumpleañera)
                        </span>
                        <span className="text-xs font-black text-white uppercase">
                          Violeta Osorio C.
                        </span>
                      </div>
                      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2 text-center">
                        <span className="text-[8px] text-cyan-300 font-bold uppercase tracking-widest block mb-1">
                          Reclutas Confirmadas
                        </span>
                        <span className="text-[10px] font-bold text-white uppercase">
                          Ana • Susana • Violeta H.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Zona de Validación Biométrica */}
            <div className="w-full space-y-4 z-10 pb-4">
              <div className="relative flex flex-col items-center">
                <button
                  disabled={isScanning || isScanned}
                  onMouseDown={handleScan}
                  onTouchStart={handleScan}
                  className={`relative group p-8 rounded-[2rem] border-2 transition-all duration-300 ${
                    isScanned
                      ? "bg-green-600 border-green-400 shadow-[0_0_30px_#22c55e]"
                      : "bg-black/40 border-pink-500/30 hover:border-pink-500 active:scale-95 shadow-[inset_0_0_20px_rgba(255,0,255,0.05)]"
                  }`}
                >
                  <Fingerprint
                    size={56}
                    className={`${
                      isScanning ? "text-cyan-400 animate-pulse" : "text-white"
                    }`}
                  />

                  {isScanning && (
                    <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                      <div
                        className="w-full h-2 bg-pink-500 shadow-[0_0_20px_#ff00ff] absolute top-0 animate-scanLine"
                        style={{
                          animation: "scanLine 2.5s ease-in-out infinite",
                        }}
                      />
                    </div>
                  )}
                </button>

                <div className="mt-4">
                  <p
                    className={`text-[9px] font-black tracking-[0.4em] uppercase transition-colors ${
                      isScanned
                        ? "text-green-400"
                        : isScanning
                        ? "text-cyan-400"
                        : "text-white/30"
                    }`}
                  >
                    {isScanning
                      ? "Verificando Líder..."
                      : isScanned
                      ? "IDENTIDAD CONFIRMADA"
                      : "Validar Huella para Reclutar"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PANTALLA DE REVELACIÓN / CELEBRACIÓN CON IA Y COORDENADAS */
          <div className="flex flex-col items-center justify-start py-8 px-6 text-center bg-gradient-to-b from-[#1a051a] to-black min-h-full animate-in fade-in duration-700">
            {/* Header de Celebración Modernizado */}
            <div className="mt-8 mb-6 flex flex-col items-center w-full relative z-10">
              {/* Etiqueta Nivel Debut Ultra-Moderna */}
              <div className="relative inline-flex mb-6 group">
                <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#00ffff] via-[#ff00ff] to-[#00ffff] rounded-full blur-md group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-pulse"></div>
                <div className="relative inline-flex items-center justify-center px-6 py-2 text-[10px] font-black text-white uppercase transition-all duration-200 bg-black border border-white/20 rounded-full tracking-[0.3em]">
                  <Sparkles size={12} className="text-cyan-400 mr-2" />
                  NIVEL DEBUT 2026
                  <Sparkles size={12} className="text-pink-400 ml-2" />
                </div>
              </div>

              {/* Torta de Cumpleaños Brillante */}
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-pink-500 to-cyan-500 opacity-30 rounded-full"></div>
                <Cake
                  size={60}
                  className="text-pink-400 relative z-10 animate-bounce"
                  style={{
                    filter: "drop-shadow(0 0 15px rgba(255,0,255,0.8))",
                  }}
                />
              </div>
            </div>

            {/* Texto de Cumpleaños con Gradiente Metálico */}
            <h2
              className="text-4xl font-black italic tracking-tighter leading-none uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
              style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }}
            >
              ¡FELIZ
              <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500"
                style={{ filter: "drop-shadow(0 0 15px rgba(0,255,255,0.6))" }}
              >
                CUMPLE!
              </span>
            </h2>

            {/* Nombre de la cumpleañera con separadores */}
            <div className="flex items-center gap-3 mb-8 mt-2">
              <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-pink-500 rounded-full"></div>
              <p
                className="text-[11px] text-pink-300 font-bold tracking-[0.4em] uppercase"
                style={{ filter: "drop-shadow(0 0 5px rgba(255,0,255,0.5))" }}
              >
                Violeta Osorio C.
              </p>
              <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-pink-500 rounded-full"></div>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] w-full space-y-5 relative overflow-hidden backdrop-blur-xl shadow-2xl mb-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

              <div className="space-y-3">
                <p className="text-xs text-white/80 leading-relaxed font-bold">
                  "Escuadrón reclutado con éxito."
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center gap-2">
                    <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] text-cyan-300">
                      ANA CONFIRMADA
                    </span>
                    <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] text-cyan-300">
                      SUSANA CONFIRMADA
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-pink-500/10 border border-pink-500/20 rounded text-[8px] text-pink-300 mx-auto">
                    VIOLETA H. CONFIRMADA
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN NUEVA: COORDENADAS Y RSVP */}
            <div className="w-full mb-6">
              <div className="bg-black/60 border border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,255,255,0.1)] text-left space-y-4 mb-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <MapPin size={60} />
                </div>

                <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-black border-b border-cyan-500/30 pb-2">
                  Coordenadas de la Misión
                </p>

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3 text-sm text-white/90">
                    <Calendar size={18} className="text-pink-500 shrink-0" />
                    <span className="font-medium">15 de Marzo de 2026</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/90">
                    <Clock size={18} className="text-pink-500 shrink-0" />
                    <span className="font-medium">3:00 de la tarde</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-white/90">
                    <MapPin
                      size={18}
                      className="text-pink-500 shrink-0 mt-0.5"
                    />
                    <span className="font-medium leading-tight">
                      Carrera 9# 11-28
                      <br />
                      <span className="text-xs text-white/60">Apto 302</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de Confirmación (WhatsApp) */}
              <button
                onClick={handleRSVP}
                className="w-full py-3.5 bg-green-600/90 hover:bg-green-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-400/50"
              >
                <MessageCircle size={16} /> Confirmar Asistencia
              </button>
            </div>

            {/* SECCIÓN INTERACTIVA DE IA GEMINI */}
            <div className="w-full mb-8">
              {!aiData && !isGenerating && (
                <button
                  onClick={fetchAiMission}
                  className="w-full py-4 px-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_#ff00ff] transition-all flex items-center justify-center gap-2 group border border-pink-400/50"
                >
                  <Sparkles
                    className="text-yellow-300 group-hover:animate-spin"
                    size={16}
                  />
                  ✨ Generar Nombre y Misión IA ✨
                </button>
              )}

              {isGenerating && (
                <div className="w-full py-6 bg-white/5 border border-cyan-500/30 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-cyan-400" size={24} />
                  <p className="text-[9px] text-cyan-300 tracking-[0.2em] font-mono animate-pulse uppercase">
                    Conectando con Yung AI...
                  </p>
                </div>
              )}

              {aiError && !isGenerating && (
                <p className="text-[10px] text-red-400 mt-2 bg-red-900/20 p-3 rounded-xl border border-red-500/30 font-medium">
                  {aiError}
                </p>
              )}

              {aiData && (
                <div className="w-full text-left bg-black/60 border border-cyan-400/50 p-5 rounded-2xl shadow-[0_0_15px_rgba(0,255,255,0.2)] animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-3 border-b border-cyan-500/30 pb-2">
                    <Bot className="text-cyan-400" size={16} />
                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
                      YUNG AI • DATOS OFICIALES
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-[8px] text-white/50 uppercase tracking-widest mb-1">
                      Nombre Oficial del Grupo
                    </p>
                    <p
                      className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400"
                      style={{
                        filter: "drop-shadow(0 0 5px rgba(255,0,255,0.3))",
                      }}
                    >
                      {aiData.groupName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] text-white/50 uppercase tracking-widest mb-1">
                      Directiva de Misión
                    </p>
                    <p className="text-xs text-white/90 leading-relaxed font-medium">
                      "{aiData.mission}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={resetConsole}
              className="mt-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-cyan-400 transition-colors pb-8"
            >
              ← REINICIAR CONSOLA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
