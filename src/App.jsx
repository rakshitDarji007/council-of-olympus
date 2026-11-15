import React, { useState } from 'react';
import StarBackground from './components/StarBackground.jsx';
import WaveFooter from './components/WaveFooter.jsx';
import IntakeOracle from './components/IntakeOracle.jsx';
import CouncilStage from './components/CouncilStage.jsx';
import SubtitleBar from './components/SubtitleBar.jsx';
import InterjectionModal from './components/InterjectionModal.jsx';
import OdysseusVerdict from './components/OdysseusVerdict.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import DebugConsole from './components/DebugConsole.jsx';

import { useAudioQueue } from './hooks/useAudioQueue.js';
import { useSpeechRecognition } from './hooks/useSpeechRecognition.js';
import {
  postIntake,
  postDebate,
  postVerdict,
  postChallengeBluff,
  getDemoData,
} from './services/api.js';

import {
  Volume2,
  VolumeX,
  Settings,
  Terminal,
  Zap,
} from 'lucide-react';

const STAGES = {
  INTAKE: 'INTAKE',
  DEBATE: 'DEBATE',
  VERDICT: 'VERDICT',
};

export default function App() {
  const [currentStage, setCurrentStage] = useState(STAGES.INTAKE);
  const [dilemma, setDilemma] = useState('');
  const [conversation, setConversation] = useState([]);
  const [currentOracleQuestion, setCurrentOracleQuestion] = useState(null);
  const [emergencyData, setEmergencyData] = useState(null);

  // Debate State
  const [turns, setTurns] = useState([]);
  const [debateDynamic, setDebateDynamic] = useState('');
  const [interjections, setInterjections] = useState([]);
  const [isInterjectOpen, setIsInterjectOpen] = useState(false);
  const [isChallenging, setIsChallenging] = useState(false);

  // Verdict State
  const [verdict, setVerdict] = useState(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Deliberating opposing perspectives...');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  // Audio Playback Queue
  const {
    currentTurnIndex,
    currentTurn,
    isPlaying,
    isMuted,
    startPlayback,
    pausePlayback,
    togglePlayPause,
    skipNext,
    toggleMute,
    resetQueue,
  } = useAudioQueue({
    turns,
    onAllTurnsComplete: () => {
      handleFetchVerdict();
    },
  });

  // Speech Recognition Hook
  const [speechTargetCallback, setSpeechTargetCallback] = useState(null);
  const { isRecording, startRecording, stopRecording } = useSpeechRecognition({
    onTranscript: (text) => {
      if (speechTargetCallback) speechTargetCallback(text);
    },
  });

  const handleSubmitDilemma = async (text) => {
    setDilemma(text);
    setIsLoading(true);
    setLoadingText('Consulting the Council...');

    try {
      const res = await postIntake({
        dilemma: text,
        conversation: [],
      });

      if (res.is_emergency) {
        setEmergencyData(res);
        setIsLoading(false);
        return;
      }

      if (res.ready || !res.next_question) {
        await initiateDebate(text, []);
      } else {
        setCurrentOracleQuestion(res.next_question);
      }
    } catch (err) {
      console.error('Intake error:', err);
      await initiateDebate(text, []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (answerText) => {
    const updatedConversation = [
      ...conversation,
      { question: currentOracleQuestion, answer: answerText },
    ];
    setConversation(updatedConversation);
    setIsLoading(true);
    setLoadingText('Synthesizing your input...');

    try {
      const res = await postIntake({
        dilemma,
        conversation: updatedConversation,
      });

      if (res.is_emergency) {
        setEmergencyData(res);
        setIsLoading(false);
        return;
      }

      if (
        res.ready ||
        !res.next_question ||
        res.next_question === currentOracleQuestion ||
        updatedConversation.length >= 2
      ) {
        await initiateDebate(dilemma, updatedConversation);
      } else {
        setCurrentOracleQuestion(res.next_question);
      }
    } catch (err) {
      console.error('Follow-up error:', err);
      await initiateDebate(dilemma, updatedConversation);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToCouncilDirect = async () => {
    await initiateDebate(dilemma, conversation);
  };

  const initiateDebate = async (dilemmaText, answersList) => {
    setIsLoading(true);
    setLoadingText('Convening Athena, Poseidon, and Hermes...');

    try {
      const debateRes = await postDebate({
        dilemma: dilemmaText,
        answers: answersList,
        interjection: null,
        debateSoFar: [],
      });

      if (debateRes.turns && debateRes.turns.length > 0) {
        setTurns(debateRes.turns);
        setDebateDynamic(debateRes.debate_dynamic || '');
        setCurrentStage(STAGES.DEBATE);
      } else {
        const demo = await getDemoData();
        setTurns(demo.demo.turns);
        setCurrentStage(STAGES.DEBATE);
      }
    } catch (err) {
      console.error('Failed to initiate debate:', err);
      const demo = await getDemoData();
      setTurns(demo.demo.turns);
      setCurrentStage(STAGES.DEBATE);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchVerdict = async () => {
    setIsLoading(true);
    setLoadingText('Odysseus is formulating the strategic verdict...');

    try {
      const verdictRes = await postVerdict({
        dilemma,
        answers: conversation,
        turns,
        interjections,
      });

      setVerdict(verdictRes);
      setCurrentStage(STAGES.VERDICT);
    } catch (err) {
      console.error('Failed to get verdict:', err);
      const demo = await getDemoData();
      setVerdict(demo.demo.verdict);
      setCurrentStage(STAGES.VERDICT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterjectionSubmit = async (interjectionText) => {
    setIsLoading(true);
    setLoadingText('The Council responds to your objection...');
    const updatedInj = [...interjections, interjectionText];
    setInterjections(updatedInj);

    try {
      const newDebate = await postDebate({
        dilemma,
        answers: conversation,
        interjection: interjectionText,
        debateSoFar: turns,
      });

      if (newDebate.turns && newDebate.turns.length > 0) {
        setTurns(newDebate.turns);
        setDebateDynamic(newDebate.debate_dynamic || 'The council reacts to mortal interjection.');
      }
    } catch (err) {
      console.error('Failed to process interjection:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChallengeGod = async (godName) => {
    const godTurns = turns.filter((t) => t.speaker?.toLowerCase() === godName.toLowerCase());
    const lastGodTurn = godTurns[godTurns.length - 1];
    if (!lastGodTurn) return;

    setIsChallenging(true);
    setIsLoading(true);
    setLoadingText(`Interrogating ${godName.toUpperCase()}...`);

    try {
      const bluffRes = await postChallengeBluff({
        god: godName,
        claim: lastGodTurn.text,
        dilemma,
      });

      if (bluffRes.defense) {
        const defenseTurn = {
          round: (lastGodTurn.round || 1) + 1,
          speaker: godName.toLowerCase(),
          addressed_to: 'mortal',
          stance: lastGodTurn.stance || 'conditional',
          text: `[Challenged]: ${bluffRes.defense}`,
        };
        setTurns((prev) => [...prev, defenseTurn]);
      }
    } catch (err) {
      console.error('Challenge error:', err);
    } finally {
      setIsChallenging(false);
      setIsLoading(false);
    }
  };

  const handleLoadDemoDilemma = async () => {
    try {
      const data = await getDemoData();
      setDilemma(data.demo.dilemma);
      setConversation(data.demo.intake_qa);
      setTurns(data.demo.turns);
      setVerdict(data.demo.verdict);
      setCurrentStage(STAGES.DEBATE);
    } catch (e) {
      console.error('Demo load error', e);
    }
  };

  const handleReset = () => {
    resetQueue();
    setDilemma('');
    setConversation([]);
    setCurrentOracleQuestion(null);
    setEmergencyData(null);
    setTurns([]);
    setDebateDynamic('');
    setInterjections([]);
    setVerdict(null);
    setCurrentStage(STAGES.INTAKE);
  };

  const handleReplayDebate = () => {
    resetQueue();
    setCurrentStage(STAGES.DEBATE);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#E8A28E] selection:text-[#07080D]">
      <StarBackground />

      {/* FULL-BLEED FROSTED HEADER (Inspired by Image 1 & Hermes Agent) */}
      <header className="relative z-40 w-full bg-[#07080D]/40 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-8 py-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <div
            onClick={handleReset}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full frosted-capsule flex items-center justify-center text-[#E8A28E] font-serif font-bold text-sm shadow-sm">
              Ω
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-display text-sm sm:text-base font-bold tracking-[0.2em] text-white uppercase group-hover:text-[#E8A28E] transition-colors">
                The Council of Olympus
              </span>
              <span className="hidden lg:inline-block text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full frosted-capsule text-zinc-400">
                Homeric Decision Engine
              </span>
            </div>
          </div>

          {/* Frosted Center Search/Context Capsule (Inspired by Image 1 Header) */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full frosted-capsule text-xs text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A28E] animate-pulse" />
            <span className="font-sans text-[11px] text-zinc-300 font-medium">
              Athena (Strategy) • Poseidon (Downside) • Hermes (Agility) • Odysseus (Ruling)
            </span>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleLoadDemoDilemma}
              title="Load sample scenario"
              className="px-4 py-1.5 rounded-full frosted-capsule text-zinc-200 hover:text-white text-xs font-sans font-medium transition flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <Zap size={13} className="text-[#E8A28E]" />
              <span className="hidden sm:inline">Sample Dilemma</span>
            </button>

            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className={`p-2 rounded-full border transition ${
                isMuted
                  ? 'bg-rose-950/50 text-rose-300 border-rose-500/40'
                  : 'frosted-capsule text-zinc-400 hover:text-white'
              }`}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <button
              onClick={() => setIsDebugOpen(true)}
              title="Telemetry & Logs"
              className="p-2 rounded-full frosted-capsule text-zinc-400 hover:text-white transition"
            >
              <Terminal size={15} />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              className="p-2 rounded-full frosted-capsule text-zinc-400 hover:text-white transition"
            >
              <Settings size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT (Expansive & Open, No Island Box) */}
      <main className="relative z-20 flex-1 flex flex-col justify-center py-8 sm:py-14 px-4 sm:px-6">
        {/* Loading Modal */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xl select-none animate-fade-in">
            <div className="editorial-card p-6 sm:p-8 rounded-3xl max-w-sm text-center shadow-2xl">
              <div className="w-8 h-8 mx-auto mb-4 border-2 border-[#E8A28E] border-t-transparent rounded-full animate-spin" />
              <h3 className="font-heading text-lg font-normal text-white mb-1">
                The Council Deliberates
              </h3>
              <p className="text-xs font-sans text-zinc-400">
                {loadingText}
              </p>
            </div>
          </div>
        )}

        {/* STAGE 1: INTAKE */}
        {currentStage === STAGES.INTAKE && (
          <IntakeOracle
            dilemma={dilemma}
            conversation={conversation}
            currentQuestion={currentOracleQuestion}
            isWaiting={isLoading}
            isRecording={isRecording}
            emergencyData={emergencyData}
            onSubmitDilemma={handleSubmitDilemma}
            onSubmitAnswer={handleSubmitAnswer}
            onProceedToCouncil={handleProceedToCouncilDirect}
            onStartVoiceInput={() => {
              setSpeechTargetCallback(() => {});
              startRecording();
            }}
            onStopVoiceInput={stopRecording}
            onSelectSampleDilemma={(text) => handleSubmitDilemma(text)}
          />
        )}

        {/* STAGE 2: COUNCIL DEBATE */}
        {currentStage === STAGES.DEBATE && (
          <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 sm:gap-10">
            <CouncilStage
              currentSpeaker={currentTurn?.speaker || 'athena'}
              turns={turns}
              currentTurnIndex={currentTurnIndex}
              debateDynamic={debateDynamic}
              onChallengeGod={handleChallengeGod}
              isChallenging={isChallenging}
            />

            <SubtitleBar
              currentTurn={currentTurn}
              turnIndex={currentTurnIndex}
              totalTurns={turns.length}
              isPlaying={isPlaying}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              onNextTurn={skipNext}
              onSkipToVerdict={handleFetchVerdict}
              onOpenInterject={() => setIsInterjectOpen(true)}
              onTogglePlayPause={togglePlayPause}
              isGenerating={isLoading}
            />
          </div>
        )}

        {/* STAGE 3: ODYSSEUS' VERDICT */}
        {currentStage === STAGES.VERDICT && (
          <OdysseusVerdict
            verdict={verdict}
            dilemma={dilemma}
            onReset={handleReset}
            onReplayDebate={handleReplayDebate}
          />
        )}
      </main>

      {/* FULL-BLEED FOOTER */}
      <WaveFooter isLoading={isLoading} />

      {/* MODALS */}
      <InterjectionModal
        isOpen={isInterjectOpen}
        onClose={() => setIsInterjectOpen(false)}
        onSubmitInterjection={handleInterjectionSubmit}
        isRecording={isRecording}
        onStartVoiceInput={() => {
          setSpeechTargetCallback(() => {});
          startRecording();
        }}
        onStopVoiceInput={stopRecording}
        isSubmitting={isLoading}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <DebugConsole
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
      />
    </div>
  );
}
