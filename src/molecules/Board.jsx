function Pill({ color }) {
    return (
        <div
            className={`z-10 w-8 h-8 rounded-full border-2 border-black ${color ? 'bg-slate-400' : 'bg-slate-700'}`}
        >{color}</div>
    );
}

function Pile({ idx, dir, count, color }) {
    return (
        <div className={`flex flex-col gap-2 w-9 h-[300px] items-center ${dir ? 'justify-start' : 'justify-end'}`}>
            <div className={`w-1 z-0 h-[250px] ${idx % 2 ? 'bg-red-700' : 'bg-slate-800'} absolute`} />
            {Array.from({ length: count }).map((_, i) => (
                <Pill key={i} color={color} />
            ))}
        </div>
    );
}

export function Board({ state }) {
    if (!state.board) {
        return null;
    }

    return (
        <div className="w-fit h-fit  bg-zinc-600 border border-[20px] border-zinc-400">
            <div className="flex flex-row gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Pile key={i} idx={i} dir={true} count={state.board[0][i + 1] || state.board[1][i + 1]} color={state.board[0][i + 1] === 0} />
                ))}
                <div className="w-12 h-[300px] bg-zinc-800" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <Pile key={6 + i} idx={i} dir={true} count={state.board[0][6 + i + 1] || state.board[1][6 + i + 1]} color={state.board[0][6 + i + 1] === 0} />
                ))}
            </div>
            <div className="flex flex-row gap-2">
                {Array.from({ length: 6 }).map((_, i) => i).reverse().map(i => (
                    <Pile key={18 + i} idx={i} dir={false} count={state.board[0][18 + i + 1] || state.board[1][18 + i + 1]} color={state.board[0][18 + i + 1] === 0} />
                ))}
                <div className="w-12 h-[300px] bg-zinc-800" />
                {Array.from({ length: 6 }).map((_, i) => i).reverse().map(i => (
                    <Pile key={i} idx={i} dir={false} count={state.board[0][12 + i + 1] || state.board[1][12 + i + 1]} color={state.board[0][12 + i + 1] === 0} />
                ))}
            </div>
        </div>
    );
}