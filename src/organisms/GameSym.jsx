import { useState } from 'react';
import { startState, playDice } from '../sym';
import { Board } from '../molecules';

export function GameSym() {
    const [initialState, setInitialState] = useState(startState);
    const [states, setStates] = useState([]);
    const [dice, setDice] = useState([]);
    const [player, setPlayer] = useState(0);

    const rollDice = () => {
        setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
    }

    const symulate = () => {
        const nextStates = playDice(initialState, player, dice);
        setStates([...nextStates]);
    }

    const choose = (state) => {
        setInitialState(state);
        setPlayer(1 - player);
        setStates([]);
        setDice([]);
    }

    return (
        <div className="flex flex-col items-center gap-10">

            <div className="flex flex-row items-center">
                <div className="flex flex-col gap-5 w-[300px] text-left">
                    <div className="text-2xl font-bold">{player ? "White" : "Black"}'s turn</div>
                    <div className="px-5 py-2 bg-sky-900 hover:bg-sky-800 w-fit rounded-md cursor-pointer" onClick={rollDice}>Roll</div>
                    <div className="flex flex-col gap-5 w-[300px] text-left h-[200px]">
                        {!!dice[0] && (
                            <>
                                <div className="text-lg">Dice</div>
                                <div className="flex flex-row gap-5">
                                    <div className="w-10 h-10 bg-sky-800 rounded-md flex items-center justify-center">{dice[0]}</div>
                                    <div className="w-10 h-10 bg-sky-800 rounded-md flex items-center justify-center">{dice[1]}</div>
                                </div>
                                
                                <div className="px-5 py-2 bg-sky-900 hover:bg-sky-800 w-fit rounded-md cursor-pointer" onClick={symulate}>Symulate</div>
                            </>
                        )}
                    </div>
                </div>
                <Board state={initialState} />
                <div className="flex flex-col gap-5 w-[300px] text-left"></div>
            </div>

            {states.length > 0 && (
                <>
                    <div>
                        <div className="text-2xl">Next {states.length} States</div>
                        <div className="text-md">Click on one to use it for the next dice roll</div>
                    </div>

                    <div className="w-screen p-6 overflow-auto">
                        <div className="flex flex-row gap-10">
                            {states.map((state, i) => (
                                <div key={i} className="flex flex-col items-start gap-1 cursor-pointer" onClick={() => choose(state)}>
                                    <div className="text-lg">State {i + 1}</div>
                                    <Board state={state} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}