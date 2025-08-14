import { YooptaContentValue } from "@yoopta/editor";

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

export function getContentPreview(content: YooptaContentValue) {
  // @ts-ignore
  return content[Object.keys(content)[0]].value[0].children[0].text;
}
