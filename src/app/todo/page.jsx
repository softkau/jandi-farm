'use client'

import { useState } from "react";

export default function Todo() {
  const [post, setPost] = useState({
    title: '',
    detail: '',
    due_date: '',
    tag: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/todo/new', {
        method: 'POST',
        body: JSON.stringify({
          title: post.title,
          detail: post.detail,
          due_date: post.due_date,
          tag: post.tag
        })
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false);
    }
  }

	return (
	  <div className="m-3 flex flex-col gap-3">
		  <h1>TODO Page</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-2xl gap-1 rounded-md outline outline-black-500"
      >
        <label className="flex flex-col m-1">
          <span className="font-semibold">title</span>
          <input
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            required
          ></input>
        </label>
        <label className="flex flex-col m-1">
          <span className="font-semibold">details</span>
          <textarea
            value={post.detail}
            onChange={(e) => setPost({ ...post, detail: e.target.value })}
            placeholder="입력..."
            required
          ></textarea>
        </label>
        <label className="flex flex-col m-1">
          <span className="font-semibold">due date</span>
          <input
            value={post.due_date}
            onChange={(e) => setPost({ ...post, due_date: e.target.value })}
            placeholder="2024/07/31"
            required
          ></input>
        </label>
        <label className="flex flex-col m-1">
          <span className="font-semibold">tag</span>
          <input
            value={post.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            placeholder="#example_tag"
          ></input>
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          { submitting ? 'submitting...' : 'submit' }
        </button>
      </form>
	  </div>
	);
}