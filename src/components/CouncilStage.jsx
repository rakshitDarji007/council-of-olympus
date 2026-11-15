import React from 'react';
import GodPodium from './GodPodium.jsx';
import GreekMeander from './GreekMeander.jsx';

/**
 * Olympian Council Chamber Stage:
 * Athena, Poseidon, and Hermes arranged in an executive architectural formation.
 */
export default function CouncilStage({
  currentSpeaker = 'athena',
  turns = [],
  currentTurnIndex = 0,
  debateDynamic = '',
  onChallengeGod = null,
  isChallenging = false,
}) {
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
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none px-4">
      {/* Editorial Tension Header */}
      <div className="w-full max-w-xl text-center mb-6">
        <GreekMeander opacity={0.5} className="mb-3" />
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

      {/* Council Podiums Grid */}
      <div className="w-full flex flex-wrap items-center justify-center gap-5 sm:gap-6 lg:gap-7">
        <GodPodium
          speaker="athena"
          isActive={activeSpeakerNorm === 'athena'}
          currentStance={athenaState.stance}
          latestTurnText={athenaState.latestText}
          onChallenge={onChallengeGod}
          isChallenging={isChallenging}
        />

        <GodPodium
          speaker="poseidon"
          isActive={activeSpeakerNorm === 'poseidon'}
          currentStance={poseidonState.stance}
          latestTurnText={poseidonState.latestText}
          onChallenge={onChallengeGod}
          isChallenging={isChallenging}
        />

        <GodPodium
          speaker="hermes"
          isActive={activeSpeakerNorm === 'hermes'}
          currentStance={hermesState.stance}
          latestTurnText={hermesState.latestText}
          onChallenge={onChallengeGod}
          isChallenging={isChallenging}
        />
      </div>
    </div>
  );
}
