import React, { useState, useEffect } from 'react';
import StarBackground from './components/StarBackground.jsx';
import WaveFooter from './components/WaveFooter.jsx';
import GreekMeander from './components/GreekMeander.jsx';
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
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  Terminal,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';

const STAGES = {
  INTAKE: 'INTAKE',
  DEBATE: 'DEBATE',
  VERDICT: 'VERDICT',
};

export default function App() {
  // Navigation & State
  const [currentStage, setCurrentStage] = useState(STAGES.INTAKE);
  const [dilemma, setDilemma] = useState('');
  const [conversation, setConversation] = useState([]); // Q&A array
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

  // Loading & Modals
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('The gods deliberate...');
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
    setCurrentTurnIndex,
  } = useAudioQueue({
    turns,
    onAllTurnsComplete: () => {
      // When debate turns naturally finish, transition to verdict
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

  /**
   * Handle user submitting their core dilemma
   */
  const handleSubmitDilemma = async (text) => {
    setDilemma(text);
    setIsLoading(true);
    setLoadingText('Consulting the Delphic Oracle...');

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
        // Sufficient context already, proceed to debate
        await initiateDebate(text, []);
      } else {
        setCurrentOracleQuestion(res.next_question);
      }
    } catch (err) {
      console.error('Intake error:', err);
      setCurrentOracleQuestion('What is pulling you toward this path, and what are the true costs?');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user answering an Oracle follow-up question
   */
  const handleSubmitAnswer = async (answerText) => {
    const updatedConversation = [
      ...conversation,
      { question: currentOracleQuestion, answer: answerText },
    ];
    setConversation(updatedConversation);
    setIsLoading(true);
    setLoadingText('The Oracle weighs your truth...');

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

      if (res.ready || !res.next_question || updatedConversation.length >= 4) {
        // Ready for Council Debate!
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

  /**
   * Directly proceed to Council without further questions
   */
  const handleProceedToCouncilDirect = async () => {
    await initiateDebate(dilemma, conversation);
  };

  /**
   * Start the 3-gods debate
   */
  const initiateDebate = async (dilemmaText, answersList) => {
    setIsLoading(true);
    setLoadingText('Summoning Athena, Poseidon, and Hermes to Olympus...');

    try {
      const debateRes = await postDebate({
        dilemma: dilemmaText,
        answers: answersList,
        interjection: null,
        debateSoFar: [],
      });

      setTurns(debateRes.turns || []);
      setDebateDynamic(debateRes.debate_dynamic || 'Athena, Poseidon, and Hermes dispute the mortal course.');
      setCurrentStage(STAGES.DEBATE);
      resetQueue();
      // Auto-start playback
      setTimeout(() => startPlayback(), 600);
    } catch (err) {
      console.error('Debate generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Interject mid-debate ("Speak, mortal")
   */
  const handleInterjectionSubmit = async (interjectionText) => {
    setIsLoading(true);
    setLoadingText('The Olympian gods turn to face the mortal...');
    setInterjections((prev) => [...prev, interjectionText]);

    try {
      const remainingTurns = turns.slice(0, currentTurnIndex + 1);
      const debateRes = await postDebate({
        dilemma,
        answers: conversation,
        interjection: interjectionText,
        debateSoFar: remainingTurns,
      });

      // Append new adapted turns
      const adaptedTurns = debateRes.turns || [];
      const combinedTurns = [...remainingTurns, ...adaptedTurns];
      setTurns(combinedTurns);
      if (debateRes.debate_dynamic) {
        setDebateDynamic(debateRes.debate_dynamic);
      }
      setIsInterjectOpen(false);
      // Resume playback on next turn
      skipNext();
      startPlayback();
    } catch (err) {
      console.error('Interjection update error:', err);
      setIsInterjectOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Challenge / Call Bluff on a God
   */
  const handleChallengeGod = async (speaker) => {
    setIsChallenging(true);
    const activeTurn = turns[currentTurnIndex] || {};

    try {
      const rebuttal = await postChallengeBluff({
        speaker,
        stance: activeTurn.stance || 'against',
        argument: activeTurn.text || 'Beware the storm',
        dilemma,
      });

      // Insert rebuttal immediately after current turn
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

  /**
   * Fetch and display Odysseus' Verdict
   */
  const handleFetchVerdict = async () => {
    setIsLoading(true);
    setLoadingText('Odysseus, King of Ithaca, takes the council floor...');
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

  /**
   * Load Pre-Generated Demo Dilemma (Guaranteed fail-proof demo path for judges!)
   */
  const handleLoadDemoDilemma = async () => {
    setIsLoading(true);
    setLoadingText('Loading Olympus Demo Scenario: Major Crossroads...');

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

  /**
   * Reset / Start New Consultation
   */
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

  /**
   * Replay Debate
   */
  const handleReplayDebate = () => {
    setCurrentStage(STAGES.DEBATE);
    resetQueue();
    setTimeout(() => startPlayback(), 400);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#EE8A2E] selection:text-[#12233F] grain-overlay">
      {/* Background Starfield and Clouds */}
      <StarBackground />

      {/* TOP HEADER / APP BAR */}
      <header className="relative z-40 w-full bg-[#12233F]/90 backdrop-blur-md border-b-2 border-[#EE8A2E]/40 px-4 py-3 select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Homeric Title */}
          <div
            onClick={handleReset}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#EE8A2E] flex items-center justify-center text-[#12233F] font-heading font-black shadow-md group-hover:scale-105 transition">
              🏛️
            </div>
            <div>
              <h1 className="font-heading text-lg sm:text-2xl font-bold tracking-wider text-[#EE8A2E] group-hover:text-[#FFA959] transition glow-orange">
                THE COUNCIL OF OLYMPUS
              </h1>
              <p className="text-[10px] sm:text-xs font-serif text-[#DDD3C8] tracking-widest uppercase">
                HackUTA 2026 • Homeric Decision Engine
              </p>
            </div>
          </div>

          {/* Right Action Icons & Demo Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Button for Judges */}
            <button
              onClick={handleLoadDemoDilemma}
              title="One-click fail-proof demo scenario (Major dilemma)"
              className="px-3 py-1.5 rounded-lg bg-[#EE8A2E] hover:bg-[#FFA959] text-[#12233F] text-xs font-heading font-black tracking-wider uppercase border border-[#EE8A2E] transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
            >
              <Zap size={14} className="fill-[#12233F]" />
              <span className="hidden sm:inline">Demo Dilemma</span>
            </button>

            {/* Audio Mute/Unmute */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-lg bg-[#1B1B16] hover:bg-[#12233F] text-[#DDD3C8] hover:text-[#EE8A2E] border border-[#EE8A2E]/30 transition"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Debug Console Logs */}
            <button
              onClick={() => setIsDebugOpen(true)}
              title="View live server telemetry and logs"
              className="p-2 rounded-lg bg-[#1B1B16] hover:bg-[#12233F] text-[#DDD3C8] hover:text-[#EE8A2E] border border-[#EE8A2E]/30 transition"
            >
              <Terminal size={16} />
            </button>

            {/* Settings Modal */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Settings & API Keys"
              className="p-2 rounded-lg bg-[#1B1B16] hover:bg-[#12233F] text-[#DDD3C8] hover:text-[#EE8A2E] border border-[#EE8A2E]/30 transition"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-20 flex-1 flex flex-col justify-center py-4 sm:py-6">
        {/* Loading Overlay State */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm select-none">
            <div className="torn-panel p-6 sm:p-8 rounded-2xl max-w-sm text-center border-2 border-[#EE8A2E] shadow-2xl">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#EE8A2E] border-t-transparent rounded-full animate-spin" />
              <h3 className="font-heading text-lg font-bold text-[#EE8A2E] tracking-wider mb-2 glow-orange">
                The Gods Deliberate
              </h3>
              <p className="text-xs sm:text-sm font-serif text-[#DDD3C8]">
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
              setSpeechTargetCallback((transcript) => {
                // updates will flow into input
              });
              startRecording();
            }}
            onStopVoiceInput={stopRecording}
            onSelectSampleDilemma={(text) => handleSubmitDilemma(text)}
          />
        )}

        {/* STAGE 2: COUNCIL DEBATE */}
        {currentStage === STAGES.DEBATE && (
          <div className="w-full flex flex-col gap-4 sm:gap-6">
            {/* The 3 Gods Stage Flanked by Torches */}
            <CouncilStage
              currentSpeaker={currentTurn?.speaker || 'athena'}
              turns={turns}
              currentTurnIndex={currentTurnIndex}
              debateDynamic={debateDynamic}
              onChallengeGod={handleChallengeGod}
              isChallenging={isChallenging}
            />

            {/* Synchronized Subtitle Bar & Controls */}
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

      {/* BOTTOM WAVE FOOTER & DRIFTING SHIP */}
      <WaveFooter isLoading={isLoading} />

      {/* MODALS */}
      <InterjectionModal
        isOpen={isInterjectOpen}
        onClose={() => setIsInterjectOpen(false)}
        onSubmitInterjection={handleInterjectionSubmit}
        isRecording={isRecording}
        onStartVoiceInput={() => {
          setSpeechTargetCallback((transcript) => {
            // updates flow into interjection text
          });
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
