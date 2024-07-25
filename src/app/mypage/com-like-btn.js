'use client';

import { useState } from 'react'

let cache = {
	'1234': 0
}

export default function LikeButton({ id }) {
	const [likes, setLikes] = useState(cache[id]);

	function handleClick() {
		setLikes(likes + 1);
		cache[id]++;
	}

	return <button onClick={handleClick}>Like ({likes})</button>
}