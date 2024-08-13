export default function TagCard({ name, isSelected }) {
  return (
    <div
      className={`rounded-lg border-2 border-gray-500 px-2 ${
        isSelected && "bg-gray-500"
      }`}
    >
      {name}
    </div>
  );
}
