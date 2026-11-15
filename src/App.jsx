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
  Sparkles,
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
        resetQueue();
        setCurrentStage(STAGES.DEBATE);
        setTimeout(() => startPlayback(), 100);
      } else {
        const demo = await getDemoData();
        setTurns(demo.demo.turns);
        resetQueue();
        setCurrentStage(STAGES.DEBATE);
        setTimeout(() => startPlayback(), 100);
      }
    } catch (err) {
      console.error('Failed to initiate debate:', err);
      const demo = await getDemoData();
      setTurns(demo.demo.turns);
      resetQueue();
      setCurrentStage(STAGES.DEBATE);
      setTimeout(() => startPlayback(), 100);
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
        const turnsWithInterruption = newDebate.turns.map((t, i) =>
          i === 0 ? { ...t, is_interruption: true } : t
        );
        setTurns(turnsWithInterruption);
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
          is_interruption: true,
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
      resetQueue();
      setCurrentStage(STAGES.DEBATE);
      setTimeout(() => startPlayback(), 100);
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
    setTimeout(() => startPlayback(), 100);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#1a3a52] selection:text-[#f6eddf]">
      <StarBackground />

      {/* FULL-BLEED FROSTED HEADER (Matching HackUTA Odyssey & Reference Pill Navigation) */}
      <header className="relative z-40 w-full bg-[#f6eddf]/85 backdrop-blur-md border-b border-[#ded0bc]/70 px-4 sm:px-8 py-3 select-none shadow-[0_2px_12px_rgba(26,58,82,0.03)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <div
            onClick={handleReset}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-[#eee3d2] border border-[#ded0bc] flex items-center justify-center text-[#b4654d] font-serif font-bold text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0">
              Ω
            </div>
            <div className="flex items-center gap-2.5 whitespace-nowrap">
              <span className="font-display text-sm sm:text-base font-bold tracking-[0.16em] text-[#1a3a52] uppercase group-hover:text-[#b4654d] transition-colors">
                The Council of Olympus
              </span>
              <span className="hidden xl:inline-block text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-[#eee3d2] text-[#506575] border border-[#ded0bc]">
                Homeric Decision Engine
              </span>
            </div>
          </div>

          {/* Center Archetype Capsule (Refined Minimalist Navigation) */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full header-pill-nav text-[11px] font-sans text-[#1a3a52] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b4654d] animate-pulse" />
            <span className="font-semibold text-[#1a3a52] tracking-wide">
              Athena <span className="text-[#ded0bc] mx-1">•</span> Poseidon <span className="text-[#ded0bc] mx-1">•</span> Hermes <span className="text-[#ded0bc] mx-1">•</span> Odysseus
            </span>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLoadDemoDilemma}
              title="Load Instant Demo Dilemma"
              className="p-2 rounded-full header-pill-nav text-[#b4654d] hover:text-[#1a3a52] hover:bg-[#fffbf5] transition flex items-center justify-center"
            >
              <Sparkles size={15} />
            </button>

            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className={`p-2 rounded-full border transition flex items-center justify-center ${
                isMuted
                  ? 'bg-[#fff0ed] text-[#b4654d] border-[#b4654d]'
                  : 'header-pill-nav text-[#506575] hover:text-[#1a3a52]'
              }`}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <button
              onClick={() => setIsDebugOpen(true)}
              title="Telemetry & Logs"
              className="p-2 rounded-full header-pill-nav text-[#506575] hover:text-[#1a3a52] transition flex items-center justify-center"
            >
              <Terminal size={15} />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              className="p-2 rounded-full header-pill-nav text-[#506575] hover:text-[#1a3a52] transition flex items-center justify-center"
            >
              <Settings size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT (Expansive & Open, Minimalist Parchment Layout) */}
      <main className="relative z-20 flex-1 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6">
        {/* Loading Modal */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a3a52]/40 backdrop-blur-md select-none animate-fade-in">
            <div className="odyssey-card p-6 sm:p-8 rounded-3xl max-w-sm text-center shadow-2xl bg-[#f6eddf]">
              <div className="w-8 h-8 mx-auto mb-4 border-2 border-[#b4654d] border-t-transparent rounded-full animate-spin" />
              <h3 className="font-heading text-lg font-bold text-[#1a3a52] mb-1">
                The Council Deliberates
              </h3>
              <p className="text-xs font-sans text-[#506575]">
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
          <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
            <CouncilStage
              currentSpeaker={currentTurn?.speaker || 'athena'}
              turns={turns}
              currentTurnIndex={currentTurnIndex}
              currentTurn={currentTurn}
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

      {/* FULL-BLEED MINIMALIST FOOTER */}
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
