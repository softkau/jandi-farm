export const convertTodoFromResponseJSON = (json) => {
  return {
    id: json._id,
    title: json.title,
    detail: json.detail,
    due_date: new Date(json.due_date),
    tags: json.tags,
    project: json.project,
    status: {
      done: json.done,
      is_public: json.is_public,
    },
  };
}