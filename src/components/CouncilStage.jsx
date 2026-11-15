import React from 'react';
import GodPodium from './GodPodium.jsx';
import BrazierTorch from './BrazierTorch.jsx';
import GreekMeander from './GreekMeander.jsx';

/**
 * Olympian Council Chamber Stage:
 * Athena, Poseidon, and Hermes flanked by two active torch braziers.
 */
export default function CouncilStage({
  currentSpeaker = 'athena',
  turns = [],
  currentTurnIndex = 0,
  debateDynamic = '',
  onChallengeGod = null,
  isChallenging = false,
}) {
  // Find current stances and recent quotes for each god
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

  const activeSpeakerNorm = currentSpeaker?.toLowerCase();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none px-2 sm:px-4">
      {/* Temple Frieze Header with Meander */}
      <div className="w-full text-center mb-2">
        <GreekMeander height={14} color="#EE8A2E" opacity={0.65} />
        {debateDynamic && (
          <p className="text-xs sm:text-sm font-serif text-[#EE8A2E] tracking-widest uppercase mt-1 glow-orange">
            ✦ {debateDynamic} ✦
          </p>
        )}
      </div>

      {/* Main Council Arena */}
      <div className="w-full flex items-center justify-between gap-1 sm:gap-4 relative py-2 sm:py-6">
        {/* Left Brazier Torch */}
        <div className="hidden md:flex flex-col items-center">
          <BrazierTorch
            side="left"
            height={150}
            isFlaring={activeSpeakerNorm === 'poseidon' || activeSpeakerNorm === 'athena'}
          />
        </div>

        {/* Council Podiums Grid (Athena, Poseidon, Hermes) */}
        <div className="flex-1 flex flex-wrap items-end justify-center gap-2 sm:gap-6 lg:gap-8">
          {/* Athena */}
          <GodPodium
            speaker="athena"
            isActive={activeSpeakerNorm === 'athena'}
            currentStance={athenaState.stance}
            latestTurnText={athenaState.latestText}
            onChallenge={onChallengeGod}
            isChallenging={isChallenging}
          />

          {/* Poseidon */}
          <GodPodium
            speaker="poseidon"
            isActive={activeSpeakerNorm === 'poseidon'}
            currentStance={poseidonState.stance}
            latestTurnText={poseidonState.latestText}
            onChallenge={onChallengeGod}
            isChallenging={isChallenging}
          />

          {/* Hermes */}
          <GodPodium
            speaker="hermes"
            isActive={activeSpeakerNorm === 'hermes'}
            currentStance={hermesState.stance}
            latestTurnText={hermesState.latestText}
            onChallenge={onChallengeGod}
            isChallenging={isChallenging}
          />
        </div>

        {/* Right Brazier Torch */}
        <div className="hidden md:flex flex-col items-center">
          <BrazierTorch
            side="right"
            height={150}
            isFlaring={activeSpeakerNorm === 'hermes' || activeSpeakerNorm === 'athena'}
          />
        </div>
      </div>
    </div>
  );
}
