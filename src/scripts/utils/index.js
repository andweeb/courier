export function createUID() {
    const o = () => Math.random().toString(16).slice(-4);
	return o() + o() +
		'-' + o() +
		'-' + o() +
		'-' + o() +
        '-' + o() + 
        o() + o();
}
