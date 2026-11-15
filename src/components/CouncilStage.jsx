import React, { useState, useEffect, useRef } from 'react';
import GodPodium from './GodPodium.jsx';
import GreekMeander from './GreekMeander.jsx';

const GODS = ['athena', 'poseidon', 'hermes'];

/**
 * Olympian Council Chamber Stage:
 * Circular orbital arena where the active orator sits at the TOP APEX
 * with a luminous backlight sign aura. As the debate proceeds, completed
 * orators loop down in a circle, and the next speaker ascends to the top.
 * When an interruption occurs, the personality shoots STRAIGHT UP vertically.
 */
export default function CouncilStage({
  currentSpeaker = 'athena',
  turns = [],
  currentTurnIndex = 0,
  currentTurn = null,
  debateDynamic = '',
  onChallengeGod = null,
  isChallenging = false,
}) {
  const normCurrent = (currentSpeaker || 'athena').toLowerCase();

  // Track the orbital station for each god: 'TOP', 'BOTTOM_RIGHT', 'BOTTOM_LEFT'
  const [slots, setSlots] = useState(() => ({
    athena: normCurrent === 'athena' ? 'TOP' : 'BOTTOM_RIGHT',
    poseidon: normCurrent === 'poseidon' ? 'TOP' : 'BOTTOM_RIGHT',
    hermes: normCurrent === 'hermes' ? 'TOP' : 'BOTTOM_LEFT',
  }));

  // Track animation classes currently playing on each god
  const [animClasses, setAnimClasses] = useState({
    athena: '',
    poseidon: '',
    hermes: '',
  });

  const [activeInterruption, setActiveInterruption] = useState(false);
  const prevSpeakerRef = useRef(normCurrent);
  const prevTurnIndexRef = useRef(currentTurnIndex);
  const animTimeoutRef = useRef(null);

  // Check if current turn is flagged as an interruption
  const isTurnInterruption = Boolean(
    isChallenging ||
    currentTurn?.is_interruption ||
    currentTurn?.isInterruption ||
    (currentTurn?.text &&
      /\[challenged\]|\[interruption\]|wait|hold on|stop|delusion|nonsense|that is pure delusion/i.test(
        currentTurn.text.slice(0, 35)
      ))
  );

  useEffect(() => {
    const prevSpeaker = prevSpeakerRef.current;
    const speakerChanged = normCurrent !== prevSpeaker;
    const turnChanged = currentTurnIndex !== prevTurnIndexRef.current;

    if (!speakerChanged && !turnChanged) return;

    prevSpeakerRef.current = normCurrent;
    prevTurnIndexRef.current = currentTurnIndex;

    const isInterruption = isTurnInterruption || isChallenging;
    setActiveInterruption(isInterruption);

    // Identify who moves where:
    // 1. Current speaker must occupy 'TOP'
    // 2. Previous speaker (who was at 'TOP') loops down to 'BOTTOM_LEFT'
    // 3. The remaining god moves to 'BOTTOM_RIGHT'
    const newTop = normCurrent;
    const newBottomLeft = prevSpeaker !== newTop ? prevSpeaker : GODS.find((g) => g !== newTop);
    const newBottomRight = GODS.find((g) => g !== newTop && g !== newBottomLeft);

    const newSlots = {
      [newTop]: 'TOP',
      [newBottomLeft]: 'BOTTOM_LEFT',
      [newBottomRight]: 'BOTTOM_RIGHT',
    };
    setSlots(newSlots);

    // Apply animation classes:
    if (isInterruption) {
      // Interruption: Shoots STRAIGHT UP vertically through center (no circle)
      setAnimClasses({
        [newTop]: 'anim-straight-up',
        [newBottomLeft]: 'anim-loop-top-to-bl',
        [newBottomRight]: 'anim-loop-bl-to-br',
      });
    } else {
      // Normal turn: Circular loop back down and up along the ring
      setAnimClasses({
        [newTop]: 'anim-loop-br-to-top',
        [newBottomLeft]: 'anim-loop-top-to-bl',
        [newBottomRight]: 'anim-loop-bl-to-br',
      });
    }

    // Clear active animation classes after duration so podiums settle into static slot positions
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setAnimClasses({
        athena: '',
        poseidon: '',
        hermes: '',
      });
      setActiveInterruption(false);
    }, 850);

    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, [normCurrent, currentTurnIndex, isTurnInterruption, isChallenging]);

  const handleManualInterrupt = (godName) => {
    setActiveInterruption(true);
    setAnimClasses((prev) => ({
      ...prev,
      [godName.toLowerCase()]: 'anim-straight-up',
    }));
    if (onChallengeGod) {
      onChallengeGod(godName);
    }
  };

  const getGodState = (speakerName) => {
    const speakerTurns = turns.filter(
      (t) => t.speaker?.toLowerCase() === speakerName.toLowerCase()
    );
    const latestTurn = speakerTurns[speakerTurns.length - 1];
    return {
      stance: latestTurn?.stance || null,
      latestText: latestTurn?.text || null,
    };
  };

  const athenaState = getGodState('athena');
  const poseidonState = getGodState('poseidon');
  const hermesState = getGodState('hermes');

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none px-2 sm:px-4">
      {/* Editorial Tension Header */}
      <div className="w-full max-w-xl text-center mb-3 sm:mb-5">
        <GreekMeander opacity={0.4} className="mb-2" />
        {debateDynamic ? (
          <p className="text-xs font-mono tracking-widest text-[#b4654d] uppercase font-bold">
            {debateDynamic}
          </p>
        ) : (
          <p className="text-xs font-mono tracking-widest text-[#506575] uppercase font-bold">
            Tripartite Adversarial Deliberation
          </p>
        )}
      </div>

      {/* ====================================================================
          COUNCIL ORBITAL ARENA CONTAINER (Circular carousel / stage)
          ==================================================================== */}
      <div
        className="relative w-full max-w-4xl flex items-center justify-center"
        style={{
          minHeight: 'clamp(580px, 72vh, 650px)',
        }}
      >
        {/* Subtle Architectural Orbit Track */}
        <div
          className="absolute inset-x-8 sm:inset-x-14 top-16 bottom-8 pointer-events-none rounded-[50%] border border-[#ded0bc]/15 -z-20 transition-all duration-700"
          style={{
            boxShadow: '0 0 30px rgba(222, 208, 188, 0.04), inset 0 0 40px rgba(16, 47, 70, 0.3)',
          }}
        />

        {/* ==================================================================
            THE 3 GOD PODIUMS (Revolving along the circular council orbit)
            ================================================================== */}
        <GodPodium
          speaker="athena"
          isActive={normCurrent === 'athena'}
          isInterruption={normCurrent === 'athena' && activeInterruption}
          orbitSlot={slots.athena}
          animClass={animClasses.athena}
          currentStance={athenaState.stance}
          latestTurnText={athenaState.latestText}
          onChallenge={onChallengeGod}
          onInterrupt={handleManualInterrupt}
          isChallenging={isChallenging}
        />

        <GodPodium
          speaker="poseidon"
          isActive={normCurrent === 'poseidon'}
          isInterruption={normCurrent === 'poseidon' && activeInterruption}
          orbitSlot={slots.poseidon}
          animClass={animClasses.poseidon}
          currentStance={poseidonState.stance}
          latestTurnText={poseidonState.latestText}
          onChallenge={onChallengeGod}
          onInterrupt={handleManualInterrupt}
          isChallenging={isChallenging}
        />

        <GodPodium
          speaker="hermes"
          isActive={normCurrent === 'hermes'}
          isInterruption={normCurrent === 'hermes' && activeInterruption}
          orbitSlot={slots.hermes}
          animClass={animClasses.hermes}
          currentStance={hermesState.stance}
          latestTurnText={hermesState.latestText}
          onChallenge={onChallengeGod}
          onInterrupt={handleManualInterrupt}
          isChallenging={isChallenging}
        />
      </div>
    </div>
  );
}
