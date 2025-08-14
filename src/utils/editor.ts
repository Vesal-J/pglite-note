export function generateContent(content: string) {
  // Generate a unique ID for the block
  const blockId = crypto.randomUUID();
  const textId = crypto.randomUUID();

  return {
    [blockId]: {
      id: blockId,
      value: [
        {
          id: textId,
          type: "paragraph",
          children: [
            {
              text: content,
            },
          ],
          props: {
            nodeType: "block",
          },
        },
      ],
      type: "Paragraph",
      meta: {
        order: 0,
        depth: 0,
      },
    },
  };
}
