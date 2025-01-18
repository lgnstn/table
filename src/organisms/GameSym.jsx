import { useState } from 'react';
import { startState, playDice } from '../sym';
import { Board } from '../molecules';

export function GameSym() {
    const [states, setStates] = useState([]);
    const [dice, setDice] = useState([0, 0]);

    const rollDice = () => {
        setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
    }

    const symulate = () => {
        const nextStates = playDice(startState, 0, dice);
        setStates([...states, ...nextStates]);
    }

    return (
        <div className="flex flex-col items-center gap-10">

        <div className="flex flex-row items-center">
            <div className="flex flex-col gap-5 w-[300px] text-left">
                <div className="px-5 py-2 bg-sky-900 hover:bg-sky-800 w-fit rounded-md cursor-pointer" onClick={rollDice}>Roll</div>
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
            <Board state={startState} />
            <div></div>
        </div>

        <div className="text-2xl">Next States</div>

        {states.map((state, i) => (
            <div key={i} className="flex flex-row items-center gap-10">
                <div className="text-lg">State {i}</div>
                <Board state={state} />
            </div>
        ))}
        </div>
    );
}