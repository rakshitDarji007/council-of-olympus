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
      // On any intake error, proceed directly to council debate rather than asking a stale question
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

      // If ready, no next question, identical question returned, or already answered 1-2 questions -> proceed to debate!
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

      setTurns(debateRes.turns || []);
      setDebateDynamic(debateRes.debate_dynamic || 'Athena, Poseidon, and Hermes dispute the optimal course.');
      setCurrentStage(STAGES.DEBATE);
      resetQueue();
      setTimeout(() => startPlayback(), 500);
    } catch (err) {
      console.error('Debate generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterjectionSubmit = async (interjectionText) => {
    setIsLoading(true);
    setLoadingText('The Council evaluates your interjection...');
    setInterjections((prev) => [...prev, interjectionText]);

    try {
      const remainingTurns = turns.slice(0, currentTurnIndex + 1);
      const debateRes = await postDebate({
        dilemma,
        answers: conversation,
        interjection: interjectionText,
        debateSoFar: remainingTurns,
      });

      const adaptedTurns = debateRes.turns || [];
      const combinedTurns = [...remainingTurns, ...adaptedTurns];
      setTurns(combinedTurns);
      if (debateRes.debate_dynamic) {
        setDebateDynamic(debateRes.debate_dynamic);
      }
      setIsInterjectOpen(false);
      skipNext();
      startPlayback();
    } catch (err) {
      console.error('Interjection update error:', err);
      setIsInterjectOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChallengeGod = async (speaker) => {
    setIsChallenging(true);
    const activeTurn = turns[currentTurnIndex] || {};

    try {
      const rebuttal = await postChallengeBluff({
        speaker,
        stance: activeTurn.stance || 'against',
        argument: activeTurn.text || 'Guard the downside',
        dilemma,
      });

      const newTurns = [...turns];
      newTurns.splice(currentTurnIndex + 1, 0, {
        round: activeTurn.round || 1,
        speaker: rebuttal.speaker,
        addressed_to: 'mortal',
        stance: rebuttal.stance,
        text: rebuttal.text,
      });

      setTurns(newTurns);
      skipNext();
      startPlayback();
    } catch (err) {
      console.error('Challenge error:', err);
    } finally {
      setIsChallenging(false);
    }
  };

  const handleFetchVerdict = async () => {
    setIsLoading(true);
    setLoadingText('Synthesizing Odysseus\' final ruling...');
    pausePlayback();

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
      console.error('Verdict error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemoDilemma = async () => {
    setIsLoading(true);
    setLoadingText('Loading dilemma: Computer Science vs Philosophy & Writing...');

    try {
      const data = await getDemoData();
      const demo = data.demo;
      setDilemma(demo.dilemma);
      setConversation(demo.answers);
      setTurns(demo.turns);
      setDebateDynamic(demo.debate_dynamic);
      setVerdict(demo.verdict);
      setCurrentStage(STAGES.DEBATE);
      resetQueue();
      setTimeout(() => startPlayback(), 500);
    } catch (err) {
      console.error('Failed to load demo', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetQueue();
    setCurrentStage(STAGES.INTAKE);
    setDilemma('');
    setConversation([]);
    setCurrentOracleQuestion(null);
    setTurns([]);
    setVerdict(null);
    setInterjections([]);
    setEmergencyData(null);
  };

  const handleReplayDebate = () => {
    setCurrentStage(STAGES.DEBATE);
    resetQueue();
    setTimeout(() => startPlayback(), 400);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#D97746] selection:text-[#0A0F1D] grain-overlay">
      <StarBackground />

      {/* REFINED EDITORIAL APP BAR */}
      <header className="relative z-40 w-full bg-[#0A0F1D]/80 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-3.5 select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand Title */}
          <div
            onClick={handleReset}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#D97746] to-[#E89162] flex items-center justify-center text-[#0A0F1D] font-display font-bold text-xs shadow-sm">
              Ω
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-sm sm:text-base font-bold tracking-widest text-slate-100 group-hover:text-[#D97746] transition-colors">
                THE COUNCIL OF OLYMPUS
              </h1>
              <span className="hidden md:inline-block text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-white/5">
                Strategic Decision Architecture
              </span>
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Demo Button */}
            <button
              onClick={handleLoadDemoDilemma}
              title="Load sample dilemma"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-medium border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Zap size={13} className="text-[#D97746]" />
              <span className="hidden sm:inline">Sample Dilemma</span>
            </button>

            {/* Audio Mute */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className={`p-2 rounded-xl border transition ${
                isMuted
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border-white/10'
              }`}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Telemetry Stream */}
            <button
              onClick={() => setIsDebugOpen(true)}
              title="Telemetry & Logs"
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition"
            >
              <Terminal size={15} />
            </button>

            {/* Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition"
            >
              <Settings size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="relative z-20 flex-1 flex flex-col justify-center py-6 sm:py-8">
        {/* Loading Modal */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md select-none animate-fade-in">
            <div className="editorial-card p-6 sm:p-8 rounded-2xl max-w-sm text-center shadow-2xl">
              <div className="w-8 h-8 mx-auto mb-4 border-2 border-[#D97746] border-t-transparent rounded-full animate-spin" />
              <h3 className="font-heading text-lg font-bold text-slate-100 mb-1">
                The Council Deliberates
              </h3>
              <p className="text-xs font-sans text-slate-400">
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
          <div className="w-full flex flex-col gap-6 sm:gap-8">
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
