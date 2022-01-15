const EmojiWrapper: React.FC<{ value: string }> = ({ value }) => (
  <span role="img" aria-labelledby="img">
    {value}
  </span>
);

export default EmojiWrapper;
