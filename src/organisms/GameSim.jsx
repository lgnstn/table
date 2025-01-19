import { useState } from 'react';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import { startState, playDice, stateScore, calcStats, calcWins } from '../sim';
import { Board } from '../molecules';
import { Switch } from '@mui/material';

const MODE_ONE = 'one';
const MODE_ALL = 'all';

export function DiceControl({ player, dice, rollDice, simulate }) {
    return (
        <div className="flex flex-col gap-5 w-[300px] text-left">
            <div className="text-2xl font-bold">{player ? "White" : "Black"}'s turn</div>
            <div className="px-5 py-2 bg-sky-900 hover:bg-sky-800 w-fit rounded-md cursor-pointer" onClick={rollDice}>Roll</div>
            <div className="flex flex-col gap-5 w-[300px] text-left h-[150px]">
                {!!dice[0] && (
                    <>
                        <div className="text-lg">Dice</div>
                        <div className="flex flex-row gap-5">
                            <div className="w-10 h-10 bg-sky-800 rounded-md flex items-center justify-center">{dice[0]}</div>
                            <div className="w-10 h-10 bg-sky-800 rounded-md flex items-center justify-center">{dice[1]}</div>
                        </div>
                        
                        <div className="px-5 py-2 bg-sky-900 hover:bg-sky-800 w-fit rounded-md cursor-pointer" onClick={simulate}>Simulate</div>
                    </>
                )}
            </div>
        </div>
    );
}

export function ScoreStats({ stats, q }) {
    const advantage = stats[0] > stats[1]
        ? 'black'
        : stats[0] < stats[1]
            ? 'white'
            : 'none'; 

    return (
        <div className="flex flex-col gap-1">
            <div className="text-lg font-bold">Scoring q = {q}</div>
            <div className="">Advantage <span className="font-extrabold">{advantage}</span></div>
            <div className="">{stats[0]} black better</div>
            <div className="">{stats[1]} white better</div>
            <div className="">{stats[2]} draw</div>
        </div>
    )
}

export function FullSimulationStats({ 
    initialStates,
    states,
    rounds
}) {
    const scores1 = states.map(state => stateScore(state, 1));
    const scores2 = states.map(state => stateScore(state, 2));

    const stats1 = calcStats(scores1);
    const stats2 = calcStats(scores2);
    const wins = calcWins(scores1);

    return (
        <div className="flex flex-col gap-5 w-[300px] text-left">
            <div className="text-2xl font-bold">Simulation Stats <span className="text-sm">({rounds} round{rounds !== 1 ? 's' : ''})</span></div>
            <div className="flex flex-col gap-5 w-[300px] text-left overflow-auto">
                <div className="flex flex-row gap-1 w-full justify-between">
                    <div className="text-lg">{initialStates.length} initial state{initialStates.length > 1 ? 's' : ''}</div>
                    {states.length > 0 && (
                        <div className="text-lg">{states.length} new state{states.length > 1 ? 's' : ''}</div>
                    )}
                </div>

                <div className="flex flex-row justify-between">
                    <div className="text-lg font-bold">{wins[0]} black win{wins[0] !== 1 ? 's' : ''}</div>
                    <div className="text-lg font-bold">{wins[1]} white win{wins[1] !== 1 ? 's' : ''}</div>
                </div>

                {states.length > 0 && (
                    <div className="flex flex-row justify-between">
                        <ScoreStats stats={stats1} q={1} />
                        <ScoreStats stats={stats2} q={2} />
                    </div>
                )}
            </div>
        </div>
    );
}

export function GameSim() {
    const [mode, setMode] = useState(MODE_ONE);
    const [initialStates, setInitialStates] = useState([startState]);
    const [states, setStates] = useState([]);
    const [dice, setDice] = useState([]);
    const [player, setPlayer] = useState(0);
    const [working, setWorking] = useState(false);
    const [rounds, setRounds] = useState(0);

    const rollDice = () => {
        setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
    }

    const simulate = () => {
        if (mode === MODE_ONE) {
            const nextStates = playDice(initialStates, player, dice);
            setStates([...nextStates]);
        } else {
            setWorking(true);

            setTimeout(() => {
                setRounds(r => r + 1);
                setInitialStates(states.length ? states : initialStates);
                const theStates = states.length > 0 ? states : initialStates;
                const nextStates = playDice(theStates, player, dice);
                setStates([...nextStates]);
                setWorking(false);
            }, 0);
        }
    }

    const choose = (state) => {
        if (mode === MODE_ALL) {
            return;
        }
        
        setInitialStates([state]);
        setPlayer(1 - player);
        setStates([]);
        setDice([]);
    }

    const changeMode = () => {
        setMode(mode === MODE_ONE ? MODE_ALL : MODE_ONE)
        setInitialStates([startState]);
        setRounds(0);
        setPlayer(0);
        setStates([]);
        setDice([]);
    }

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="flex flex-row items-center">
                <div className={`text-lg ${mode === MODE_ONE ? "font-extrabold": "font-light"}`}>One state</div>
                <Switch checked={mode === MODE_ALL} onChange={() => changeMode()} />   
                <div className={`text-lg ${mode === MODE_ALL ? "font-extrabold": "font-light"}`}>All states</div>
            </div>

            {mode === MODE_ONE ? (
                <div className="flex flex-row items-center">
                    <DiceControl player={player} dice={dice} rollDice={rollDice} simulate={simulate} />
                    <Board state={initialStates[0]} />
                    <div className="flex w-[300px]" />
                </div>
            ) : (
                <>
                    <div className="flex flex-row">
                        <DiceControl player={player} dice={dice} rollDice={rollDice} simulate={simulate} />
                        <FullSimulationStats
                            initialStates={initialStates}
                            states={states}
                            rounds={rounds}
                        />
                    </div>

                    <div className="text-2xl">
                        Initial {initialStates.length > 1 ? `${initialStates.length} states` : 'state'}
                    </div>
                    <div className="w-screen p-6 overflow-auto">
                        <div className="flex flex-row gap-10">
                            {initialStates.map((state, i) => (
                                <div key={i} className="flex flex-col items-start gap-1 cursor-pointer" onClick={() => choose(state)}>
                                    <div className="text-lg">State {i + 1}</div>
                                    <Board state={state} small />
                                </div>
                            ))}
                        </div>
                        </div>
                </>
            )}

            {states.length > 0 && (
                <>
                    <div>
                        <div className="text-2xl">Next {states.length > 1 ? `${states.length} states` : 'state'}</div>
                        {mode === MODE_ONE && (
                            <div className="text-md">Click on one to use it for the next dice roll</div>
                        )}
                    </div>

                    <div className="w-screen p-6 overflow-auto">
                        <div className="flex flex-row gap-10">
                            {states.map((state, i) => (
                                <div key={i} className="flex flex-col items-start gap-1 cursor-pointer" onClick={() => choose(state)}>
                                    <div className="text-lg">State {i + 1}</div>
                                    <Board state={state} small />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {working && (
                <div className="z-50 flex flex-col gap-5 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <BlurOnIcon style={{ fontSize: 100 }} className="text-white animate-pulse" /> 
                    <div className="text-3xl font-bold text-white">Working...</div>
                </div>
            )}
        </div>
    );
}