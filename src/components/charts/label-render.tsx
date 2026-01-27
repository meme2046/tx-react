interface Props {
  data: { id: string; label: string; value: number };
}

export function LabelRender({ data }: Props) {
  const { label } = data;
  return <span>{label}</span>;
}
