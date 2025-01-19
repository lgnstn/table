import { stateScore } from '../sim';

export function Pill({ color, small }) {
    return (
        <div
            className={`z-10 ${small ? 'size-4 border-2' : 'size-9 border-4'} rounded-full border-slate-800 ${color ? 'bg-slate-400' : 'bg-slate-700'}`}
        />
    );
}

export function Pile({ idx, dir, count, color, small }) {
    return (
        <div className={`relative flex flex-col gap-0 ${small ? 'w-4 h-[150px]' : 'w-9 h-[300px]'} items-center ${dir ? 'justify-start' : 'justify-end'}`}>
            <div className={`z-0 ${small ? 'w-[2px] h-[120px]' : 'w-1 h-[250px]'} ${idx % 2 ? 'bg-red-700' : 'bg-slate-800'} absolute`} />
            {Array.from({ length: count }).map((_, i) => (
                <Pill key={i} color={color} small={small} />
            ))}
        </div>
    );
}

export function Score({ score, q, small }) {
    return (
        <div className={`flex flex-col gap-1 items-center ${small ? 'text-xs px-2' : 'text-md px-10'}`}>
            <div className="">Score (q = {q})</div>
            <div className="">
                <span className={score.b < score.w ? "font-bold" : ""}>
                    Black {score.b}
                </span>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <span className={score.b > score.w ? "font-bold" : ""}>
                    White {score.w}
                </span>
            </div>
        </div>
    )
}

export function Board({ state, small }) {
    if (!state.board) {
        return null;
    }

    const bDone = 15 - state.inGame[0];
    const wDone = 15 - state.inGame[1];
    const score1 = stateScore(state, 1);
    const score2 = stateScore(state, 2);

    return (
        <div className={``}>
            <div className={`flex flex-row gap-1 w-full ${small ? 'h-6 px-[18px]' : 'h-10 px-[10px]'} py-1 ${wDone ? 'bg-stone-700' : ''} rounded-t-md`}>
                {Array.from({ length: wDone }).map((_, i) => i).map(i => (
                    <Pill key={i} color={1} small={small} />
                ))}
            </div>
            <div className={`w-fit h-fit  bg-zinc-600 border ${small ? 'border-[10px]' : 'border-[20px]'} border-zinc-400`}>
                <div className="flex flex-row gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Pile key={i} idx={i} dir={true} count={state.board[0][i + 1] + state.board[1][i + 1]} color={state.board[0][i + 1] === 0} small={small} />
                    ))}
                    <div className={`flex flex-col justify-end gap-1 items-center ${small ? 'pb-3 w-6 h-[150px]' : 'pb-5 w-12 h-[300px]'} bg-stone-700`}>
                        {Array.from({ length: state.out[0] }).map((_, i) => i).map(i => (
                            <Pill key={i} color={0} small={small} />
                        ))}
                    </div>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Pile key={6 + i} idx={i} dir={true} count={state.board[0][6 + i + 1] + state.board[1][6 + i + 1]} color={state.board[0][6 + i + 1] === 0} small={small} />
                    ))}
                </div>
                <div className="flex flex-row gap-2">
                    {Array.from({ length: 6 }).map((_, i) => i).reverse().map(i => (
                        <Pile key={18 + i} idx={i} dir={false} count={state.board[0][18 + i + 1] + state.board[1][18 + i + 1]} color={state.board[0][18 + i + 1] === 0} small={small} />
                    ))}
                    <div className={`flex flex-col gap-1 items-center ${small ? 'pt-3 w-6 h-[150px]' : 'pt-5 w-12 h-[300px]'} bg-stone-700`}>
                        {Array.from({ length: state.out[1] }).map((_, i) => i).map(i => (
                            <Pill key={i} color={1} small={small} />
                        ))}
                    </div>
                    {Array.from({ length: 6 }).map((_, i) => i).reverse().map(i => (
                        <Pile key={i} idx={i} dir={false} count={state.board[0][12 + i + 1] + state.board[1][12 + i + 1]} color={state.board[0][12 + i + 1] === 0} small={small} />
                    ))}
                </div>
            </div>
            <div className={`flex flex-row gap-1 w-full ${small ? 'h-6 px-[18px]' : 'h-10 px-[10px]'}  ${bDone ? 'bg-stone-700' : ''} rounded-b-md`}>
                {Array.from({ length: bDone }).map((_, i) => i).map(i => (
                    <Pill key={i} color={0} small={small} />
                ))}
            </div>
            <div className="flex flex-col gap-1 items-center">
                <div className={`${small ? 'text-lg' : 'text-3xl'} font-bold`}>
                    {score1.b === 0 ? "Black wins" : ""}
                    {score1.w === 0 ? "White wins" : ""}
                </div>
            </div>
            <div className="flex flex-row gap-1 text-slate-300 w-full justify-between">
                <Score score={score1} q={1} small={small} />
                <Score score={score2} q={2} small={small} />
            </div>
        </div>
    );
}