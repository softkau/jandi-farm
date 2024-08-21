export default function TagCard({
  name,
  isSelected,
  handleSelected = () => {},
  textSize,
}) {
  return (
    <div
      className={`rounded-lg border-2 border-gray-500 px-2 cursor-pointer ${textSize} ${
        isSelected && "bg-gray-500"
      }`}
      onClick={() => handleSelected(name)}
    >
      {name}
    </div>
  );
}
